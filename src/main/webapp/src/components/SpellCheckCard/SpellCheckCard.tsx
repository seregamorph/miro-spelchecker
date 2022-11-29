import { FC, KeyboardEventHandler } from "react";
import cn from "classnames";
import { Button } from "../ui/Button";
import { SpellCheckList } from "../../utils/checks";
import { applySuggestion, zoomToElement } from "../../utils/board";
import { ContentHighlights } from "../ContentHighlights/ContentHighlights";
import styles from "./SpellCheckCard.module.css";

const MAX_SUGGESTIONS_COUNT = 3;

interface Props {
  data: SpellCheckList;
  disabled: boolean;
  onFix: VoidFunction;
}
export const SpellCheckCard: FC<Props> = ({
  data: { anchorId, property, check },
  disabled,
  onFix,
}) => {
  const zoom = async () => {
    try {
      await zoomToElement(anchorId);
    } catch (err) {
      console.error("Can not zoom to element", err);
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLHeadingElement> = async (event) => {
    if (event.key === "Enter") {
      await zoom();
    }
  };

  const fixCheck = async (suggestion: string) => {
    try {
      await applySuggestion(property, check, suggestion);
      onFix();
    } catch (err) {
      console.error("Unable to apply the suggestion", err);
    }
  };

  const suggestions = check.suggestedReplacements
    .filter((suggestion) => suggestion)
    .slice(0, MAX_SUGGESTIONS_COUNT);

  return (
    <div className={styles.wrapper}>
      <section className={cn("app-card", styles.card)}>
        <h4
          className={cn("h4", styles.header)}
          onClick={zoom}
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
