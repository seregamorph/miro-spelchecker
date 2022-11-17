import {Item} from "@mirohq/websdk-types";
import {SpellCheckResult} from "./api";
import {isObjectWithContent} from "./board";

interface SpellCheckList {
    check: SpellCheckResult;
    item: Item;
}
export const linkChecksWithItems = (checks: SpellCheckResult[], items: Item[]): SpellCheckList[] => {
    const itemsObj = items.reduce<{[id: string]: Item}>((acc, item) => {
        return {
            ...acc,
            [item.id]: item
        }
    }, {});

    return checks.reduce<SpellCheckList[]>((acc, check) => {
        const relatedItem = itemsObj[check.itemId];
        if (!relatedItem) {
            return acc;
        }

        return [...acc, {
            check,
            item: relatedItem
        }]
    }, [])
}

export const applySuggestion = async (item: Item, check: SpellCheckResult, suggestion: string) => {
    if (!isObjectWithContent(item)) {
        return;
    }

    item.content = item.content.replace(new RegExp(check.content, 'g'), suggestion);
    await item.sync()
}