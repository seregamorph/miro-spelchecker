import { FC, useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { useTrackActiveElement } from "../hooks/useTrackActiveElement";
import { SpellCheckList } from "../utils/checks";
import { SupportedLanguage } from "../utils/language";
import { NoElementsSelected } from "./NoElementsSelected/NoElementsSelected";
import { StatusWrapper } from "./StatusWrapper/StatusWrapper";
import { SpellCheckerCardList } from "./SpellCheckerCardList/SpellCheckerCardList";
import { ItemWithContent } from "../utils/board";
import { runElementsSpellCHeck } from "../utils/spellCheck";

interface Props {
  active: boolean;
  items: ItemWithContent[];
  setItems: (items: ItemWithContent[]) => void;
  switchToAll: VoidFunction;
  onActivate: (fn: VoidFunction) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [list, setList] = useState<SpellCheckList[]>([]);

  const [pauseTracking, setPauseTracking] = useState(false);
  useTrackActiveElement(items, setItems, pauseTracking);

  const onRefresh = useCallback(async () => {
    setIsError(false);
    if (!items.length) {
      setList([]);
      return;
    }
    setIsLoading(true);
    try {
      const newList = await runElementsSpellCHeck(language, items);
      setList(newList);
    } catch (err) {
      setIsError(true);
      setList([]);
    } finally {
      setIsLoading(false);
    }
  }, [language, items]);

  const onReload = useCallback(async () => {
    setList([]);
    await onRefresh();
  }, [onRefresh]);

  const onBeforeFix = useCallback(() => {
    setPauseTracking(true);
  }, []);

  const onAfterFix = useCallback(
    (item: ItemWithContent) => {
      setItems([item]);
    },
    [setItems]
  );

  useEffect(() => {
    if (!active) {
      return;
    }

    let cancelled = false;

    onRefresh().then(() => {
      if (cancelled) {
        return;
      }
      setPauseTracking(false);
    });
    return () => {
      cancelled = true;
    };
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
        onAfterFix={onAfterFix}
        onBeforeFix={onBeforeFix}
      />
    </StatusWrapper>
  );
};
