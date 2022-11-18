import {FC} from "react";
import {Item} from "@mirohq/websdk-types";
import {SpellCheckResult} from "../../utils/api";
import {Button} from "../ui/Button";
import {applySuggestion} from "../../utils/checks";
import {isObjectWithContent} from "../../utils/board";
import {normalizeContent} from "../../utils/content";
import {ContentHighlights} from "../ContentHighlights/ContentHighlights";

interface Props {
    check: SpellCheckResult;
    item: Item;
    hideFocus?: boolean;
}
export const SpellCheckCard: FC<Props> = ({item, check, hideFocus}) => {
    const zoomToElement = () => {
        miro.board.viewport.zoomTo(item)
    };

    const fixCheck = async (suggestion: string) => {
        await applySuggestion(item, check, suggestion);
    };

    if (!isObjectWithContent(item)) {
        return null;
    }

    return <section>
        <h4 className="h4"><ContentHighlights highlight={check.content}>{normalizeContent(item.content)}</ContentHighlights></h4>
        <div className="grid">
            <div className="cs1 ce8 align-self-end">
                {check.suggestions.map(suggestion => (
                    <Button key={suggestion} size="small" type="secondary" onClick={() => fixCheck(suggestion)}>{suggestion}</Button>
                ))}
            </div>
            {!hideFocus && <div className="cs10 ce12 align-self-start justify-self--end">
                <Button type="secondary" size="small" onClick={zoomToElement}>
                    <span className="icon icon-eye cursor-pointer" />
                </Button>
            </div>}
        </div>
    </section>
}
