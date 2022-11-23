import { FC, useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { useTrackActiveElement } from "../hooks/useTrackActiveElement";
import { linkChecksWithItems, SpellCheckList } from "../utils/checks";
import { SupportedLanguage } from "../utils/language";
import { NoElementsSelected } from "./NoElementsSelected/NoElementsSelected";
import { StatusWrapper } from "./StatusWrapper/StatusWrapper";
import { SpellCheckerCardList } from "./SpellCheckerCardList/SpellCheckerCardList";
import {
  getBoardObjectsWithContent,
  getContentFromElements,
  ItemWithContent,
} from "../utils/board";
import { VoidFn } from "../utils/common";
import { runSpellCheckRequest } from "../utils/api";

interface Props {
  active: boolean;
  items: ItemWithContent[];
  setItems: (items: ItemWithContent[]) => void;
  switchToAll: VoidFn;
  onActivate: (fn: VoidFn) => void;
  className: string;
  language: SupportedLanguage;
}
export const SelectedElementsChecks: FC<Props> = ({
  active,
  items,
  setItems,
  switchToAll,
  onActivate,
  className,
  language,
}) => {
  useTrackActiveElement(items, setItems);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [list, setList] = useState<SpellCheckList[]>([]);

  const onRefresh = useCallback(async () => {
    if (!items.length) {
      setList([]);
      return;
    }
    setIsLoading(true);
    try {
      const boardItems = await miro.board.get({
        id: items.map(({ id }) => id),
      });
      const itemsWithContent = getBoardObjectsWithContent(boardItems);
      const content = getContentFromElements(itemsWithContent);
      const newChecks = await runSpellCheckRequest({
        language,
        elements: content,
      });
      const newList = linkChecksWithItems(itemsWithContent, newChecks);
      setList(newList);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [language, items]);

  const onReload = useCallback(async () => {
    setList([]);
    await onRefresh();
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }
    onRefresh();
  }, [onRefresh, active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    onActivate(onReload);
  }, [active, onActivate, onReload]);

  if (!active) {
    return null;
  }

  if (!items.length) {
    return (
      <div className={cn("centered", className)}>
        <NoElementsSelected onSwitch={switchToAll} />
      </div>
    );
  }

  return (
    <StatusWrapper
      isError={isError}
      isLoading={isLoading}
      className={className}
      count={list.length}
    >
      <SpellCheckerCardList
        className={className}
        items={list}
        disabled={isLoading}
        onFix={onRefresh}
      />
    </StatusWrapper>
  );
};
