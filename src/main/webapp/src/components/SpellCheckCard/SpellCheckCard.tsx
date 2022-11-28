import { FC, KeyboardEventHandler } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import { applySuggestion, SpellCheckList } from "../../utils/checks";
import { isObjectWithContent, ItemWithContent } from "../../utils/board";
import { ContentHighlights } from "../ContentHighlights/ContentHighlights";
import styles from "./SpellCheckCard.module.css";

const MAX_SUGGESTIONS_COUNT = 3;

interface Props {
  data: SpellCheckList;
  disabled: boolean;
  onBeforeFix?: VoidFunction;
  onAfterFix?: (item: ItemWithContent) => void;
}
export const SpellCheckCard: FC<Props> = ({
  data: { item, check },
  disabled,
  onBeforeFix,
  onAfterFix,
}) => {
  const zoomToElement = async () => {
    await miro.board.viewport.zoomTo(item);
  };

  const onKeyDown: KeyboardEventHandler<HTMLHeadingElement> = async (event) => {
    if (event.key === "Enter") {
      await zoomToElement();
    }
  };

  const fixCheck = async (suggestion: string) => {
    try {
      onBeforeFix?.();
      const updated = await applySuggestion(item, check, suggestion);
      onAfterFix?.(updated);
    } catch (err) {
      console.log("Unable to apply the suggestion", err);
    }
  };

  if (!isObjectWithContent(item)) {
    return null;
  }

  const suggestions = check.suggestedReplacements
    .filter((suggestion) => suggestion)
    .slice(0, MAX_SUGGESTIONS_COUNT);

  return (
    <div className={styles.wrapper}>
      <section className={cn("app-card", styles.card)}>
        <h4
          className={cn("h4", styles.header)}
          onClick={zoomToElement}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
        >
          <ContentHighlights check={check} />
        </h4>
        <div className={cn("grid", styles.body)}>
          <div className={cn("cs1", "ce12", styles.suggestions)}>
            {suggestions.length ? (
              suggestions.map((suggestion) => (
                <p key={suggestion}>
                  <Button
                    size="small"
                    type="secondary"
                    onClick={() => fixCheck(suggestion)}
                    disabled={disabled}
                  >
                    {suggestion}
                  </Button>
                </p>
              ))
            ) : (
              <p className="p-small">{check.message}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
