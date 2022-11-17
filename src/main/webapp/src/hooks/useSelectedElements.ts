import {useEffect, useState} from "react";
import {SelectionUpdateEvent, Item} from "@mirohq/websdk-types";

export const useSelectedElements = () => {
    const state = useState<Item[] | undefined>(undefined);
    const [_, setItems] = state;

    useEffect(() => {
        let cancelled = false;

        miro.board.getSelection()
            .catch(() => {
                // TODO handle error
                return []
            })
            .then((items) => {
                if (cancelled) {
                    return;
                }
                setItems(items);
            })

        return () => {
            cancelled = true;
        }
    }, []);

    useEffect(() => {
        const onSelection = (event: SelectionUpdateEvent) => {
            setItems(event.items || [])
        }

        miro.board.ui.on('selection:update', onSelection);
        return () => {
            miro.board.ui.off('selection:update', onSelection);
        }
    }, []);

    return state;
}