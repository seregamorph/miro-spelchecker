import {FC, useState} from "react";
import {Item} from "@mirohq/websdk-types";
import cn from 'classnames';
import checkboxIcon from 'mirotone/dist/icons/checkbox.svg';
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
}
export const SpellCheckCard: FC<Props> = (({item, check}) => {
    const [replaced, setReplaced] = useState(false);

    const zoomToElement = async () => {
        await miro.board.viewport.zoomTo(item)
    };

    const fixCheck = async (suggestion: string) => {
        try {
            await applySuggestion(item, check, suggestion);
            setReplaced(true);
        } catch (err) {
            console.log('Unable to apply the suggestion', err);
        }
    };

    if (!isObjectWithContent(item)) {
        return null;
    }

    const suggestions = check
        .suggestedReplacements
        .filter(suggestion => suggestion)
        .slice(0, MAX_SUGGESTIONS_COUNT)

    return <section className={styles.card}>
        <h4 className={cn("h4", styles.header)} onClick={zoomToElement} role="button" tabIndex={0}>
            <ContentHighlights check={check} replaced={replaced}>
                {normalizeContent(item.content)}
            </ContentHighlights>
        </h4>
        <div className={cn("grid", styles.body)}>
            <div className={cn("cs1", "ce12", "grid", {
                'align-self-center': replaced || !suggestions.length
            })} >
                {replaced ? (
                    <>
                        <img className={styles.success} src={checkboxIcon} alt="" />
                        <span className={cn('p-small', styles.done)}>Done</span>
                    </>
                ) : (
                    <>
                        {suggestions.map(suggestion => (
                            <p key={suggestion}>
                                <Button size="small" type="secondary" onClick={() => fixCheck(suggestion)}>{suggestion}</Button>
                            </p>
                        ))}
                        {!suggestions.length && <p className="p-small cs1 ce12">{check.message}</p>}
                   </>
                )}
            </div>
        </div>
    </section>
});
