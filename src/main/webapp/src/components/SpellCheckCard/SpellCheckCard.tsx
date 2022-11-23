import { FC, KeyboardEventHandler } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import { applySuggestion, SpellCheckList } from "../../utils/checks";
import { isObjectWithContent } from "../../utils/board";
import { ContentHighlights } from "../ContentHighlights/ContentHighlights";
import styles from "./SpellCheckCard.module.css";

const MAX_SUGGESTIONS_COUNT = 3;

interface Props {
  data: SpellCheckList;
  disabled: boolean;
  onFix: VoidFunction;
}
export const SpellCheckCard: FC<Props> = ({
  data: { item, check },
  disabled,
  onFix,
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
      await applySuggestion(item, check, suggestion);
      onFix();
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
    <section className={styles.card}>
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
        <div
          className={cn("cs1", "ce12", "grid", {
            "align-self-center": !suggestions.length,
          })}
        >
          {suggestions.map((suggestion) => (
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
          ))}
          {!suggestions.length && (
            <p className="p-small cs1 ce12">{check.message}</p>
          )}
        </div>
      </div>
    </section>
  );
};
