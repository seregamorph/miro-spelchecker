import {ElementContent} from "./board";
import {SupportedLanguage} from "./language";

export interface SpellCheckResult {
    elementId: string;
    fromPos: number;
    toPos: number;
    message: string;
    suggestedReplacements: string[];
}

export interface RequestData {
    elements: ElementContent[];
    language: SupportedLanguage;
}
export const runSpellCheckRequest = (payload: RequestData): Promise<SpellCheckResult[]> => {
    const url = new URL('/spellcheck', document.location.href);

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            return response.json();
        })
}