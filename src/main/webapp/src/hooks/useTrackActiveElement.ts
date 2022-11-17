import {useEffect} from "react";
import {Item} from "@mirohq/websdk-types";
import {isObjectWithContent} from "../utils/board";

const POLLING_INTERVAL = 1_000;

export const useTrackActiveElement = (items: Item[], onContent: (items: Item[]) => void) => {
    useEffect(() => {
        if (items.length !== 1) {
            return;
        }

        const activeItem = items[0];

        if (!isObjectWithContent(activeItem)) {
            return;
        }

        let cancelled = false;

        const detectElementChanges = () => {
            miro.board.get({id: activeItem.id})
                .then(updatedItems => {
                    if (cancelled) {
                        return;
                    }
                    if (updatedItems.length !== 1) {
                        // TODO error
                        return;
                    }
                    const updatedItem = updatedItems[0];

                    if (!isObjectWithContent(updatedItem)) {
                        return;
                    }

                    if (updatedItem.content === activeItem.content) {
                        return;
                    }

                    onContent([updatedItem])
                })
        }

        const interval = setInterval(detectElementChanges, POLLING_INTERVAL);
        return () => {
            cancelled = true;
            clearInterval(interval);
        }
    }, [items, onContent]);
}