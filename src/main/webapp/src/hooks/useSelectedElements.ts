import { useCallback, useEffect, useState } from "react";
import { BoardNode, SelectionUpdateEvent } from "@mirohq/websdk-types";

export const useSelectedElements = () => {
  const [items, setItems] = useState<BoardNode[] | undefined>(undefined);

  const refreshSelection = useCallback(() => {
    miro.board
      .getSelection()
      .catch(() => {
        // TODO handle error
        return [];
      })
      .then((items) => {
        setItems(items);
      });
  }, []);

  useEffect(() => {
    refreshSelection();
  }, [refreshSelection]);

  useEffect(() => {
    const onSelection = (event: SelectionUpdateEvent) => {
      setItems(event.items);
    };

    miro.board.ui.on("selection:update", onSelection);
    return () => {
      miro.board.ui.off("selection:update", onSelection);
    };
  }, []);

  return {
    items,
    refreshSelection,
  };
};
