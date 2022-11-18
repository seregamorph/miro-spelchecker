import {ItemContent} from "./board";
import {SupportedLanguage} from "./language";

export interface SpellCheckResult {
    id: string;
    itemId: string;
    content: string;
    suggestions: string[];
}

interface RequestData {
    items:ItemContent[];
    language: SupportedLanguage;
}
export const runSpellCheckRequest = ({items, language}: RequestData): Promise<SpellCheckResult[]> => {
    return Promise.resolve()
        .then(() => {
            if (language === "nl-NL") {
                return [];
            }
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