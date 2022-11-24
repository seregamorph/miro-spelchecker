import { useEffect, useState } from "react";
import { SelectionUpdateEvent } from "@mirohq/websdk-types";
import { getBoardObjectsWithContent, ItemWithContent } from "../utils/board";

export const useSelectedElements = () => {
  const state = useState<ItemWithContent[] | undefined>(undefined);
  const [, setItems] = state;

  useEffect(() => {
    let cancelled = false;

    miro.board
      .getSelection()
      .catch(() => {
        // TODO handle error
        return [];
      })
      .then((items) => {
        if (cancelled) {
          return;
        }
        const itemsWithContent = getBoardObjectsWithContent(items);
        setItems(itemsWithContent);
      });

    return () => {
      cancelled = true;
    };
  }, [setItems]);

  useEffect(() => {
    const onSelection = (event: SelectionUpdateEvent) => {
      const itemsWithContent = getBoardObjectsWithContent(event.items);
      setItems(itemsWithContent);
    };

    miro.board.ui.on("selection:update", onSelection);
    return () => {
      miro.board.ui.off("selection:update", onSelection);
    };
  }, [setItems]);

  return state;
};
