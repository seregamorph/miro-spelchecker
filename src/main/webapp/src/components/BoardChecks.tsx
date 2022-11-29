import { FC, useCallback, useEffect, useState } from "react";
import { SpellCheckList } from "../utils/checks";
import { SupportedLanguage } from "../utils/language";
import { StatusWrapper } from "./StatusWrapper/StatusWrapper";
import { SpellCheckerCardList } from "./SpellCheckerCardList/SpellCheckerCardList";
import { runBoardSpellCheck } from "../utils/spellCheck";

interface Props {
  active: boolean;
  onActivate: (fn: VoidFunction) => void;
  className: string;
  language: SupportedLanguage;
}
export const BoardChecks: FC<Props> = ({
  active,
  onActivate,
  className,
  language,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [list, setList] = useState<SpellCheckList[]>([]);

  const onRefresh = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const newList = await runBoardSpellCheck(language);
      setList(newList);
    } catch (err) {
      setIsError(true);
      setList([]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const onReload = useCallback(async () => {
    setList([]);
    await onRefresh();
  }, [onRefresh]);

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
