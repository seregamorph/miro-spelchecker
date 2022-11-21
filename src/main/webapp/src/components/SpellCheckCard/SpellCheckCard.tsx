import {FC} from "react";
import {Item} from "@mirohq/websdk-types";
import cn from 'classnames';
import {SpellCheckResult} from "../../utils/api";
import {Button} from "../ui/Button";
import {applySuggestion} from "../../utils/checks";
import {isObjectWithContent} from "../../utils/board";
import {normalizeContent} from "../../utils/content";
import {ContentHighlights} from "../ContentHighlights/ContentHighlights";
import styles from './SpellCheckCard.module.css';

const MAX_SUGGESTIONS_COUNT = 3;

interface Props {
    check: SpellCheckResult;
    item: Item;
    hideFocus?: boolean;
}
export const SpellCheckCard: FC<Props> = (({item, check, hideFocus}) => {
    const zoomToElement = () => {
        miro.board.viewport.zoomTo(item)
    };

    const fixCheck = async (suggestion: string) => {
        await applySuggestion(item, check, suggestion);
    };

    if (!isObjectWithContent(item)) {
        return null;
    }

    const suggestions = check.suggestedReplacements.slice(0, MAX_SUGGESTIONS_COUNT)

    return <section className={styles.card}>
        <h4 className={cn("h4", styles.header)}><ContentHighlights check={check}>{normalizeContent(item.content)}</ContentHighlights></h4>
        <div className="grid">
            <p className={cn("cs1", "ce8", "align-self-end", {'p-small': !suggestions.length})} >
                {suggestions.map(suggestion => (
                    <Button key={suggestion} size="small" type="secondary" onClick={() => fixCheck(suggestion)}>{suggestion}</Button>
                ))}
                {!suggestions.length && <>{check.message}</>}
            </p>
            {!hideFocus && <p className="cs10 ce12 align-self-start justify-self--end">
                <Button type="secondary" size="small" onClick={zoomToElement}>
                    <span className="icon icon-eye cursor-pointer" />
                </Button>
            </p>}
        </div>
    </section>
});
