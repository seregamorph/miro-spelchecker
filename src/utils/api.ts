import {ItemContent} from "./board";

export interface SpellCheckResult {
    id: string;
    itemId: string;
    content: string;
    suggestions: string[];
}
export const runSpellCheckRequest = ({items}: {items:ItemContent[]}): Promise<SpellCheckResult[]> => {
    return Promise.resolve()
        .then(() => {
            return items.reduce<SpellCheckResult[]>((acc, item, index) => {
                if (!item.content.includes('test')) {
                    return acc;
                }
                return [...acc, {
                    id: `${index}`,
                    itemId: item.id,
                    content: 'test',
                    suggestions: ['ttest', 'tst']
                }];
            }, [])
        })
}