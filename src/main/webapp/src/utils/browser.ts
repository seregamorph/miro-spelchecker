const SPELL_CHECKER_APP_KEY = 'spell-checker';

export enum LocalStorageKey {
    Language = 'lang'
}

export const getBrowserLanguages = (): string[] => {
    const lang = getLocalStorageItem(LocalStorageKey.Language);
    if (navigator.languages && navigator.languages.length) {
        return lang ? [lang, ...navigator.languages] : [...navigator.languages];
    }
    return lang ? [lang, navigator.language] : [navigator.language];
}

const getLocalStorageItem = (key: LocalStorageKey) => {
    return window.localStorage.getItem(`${SPELL_CHECKER_APP_KEY}/${key}`);
}

export const setLocalStorageItem = (key: LocalStorageKey, value = '') => {
    if (!value) {
        window.localStorage.removeItem(`${SPELL_CHECKER_APP_KEY}/${key}`);
        return;
    }
    window.localStorage.setItem(`${SPELL_CHECKER_APP_KEY}/${key}`, value);
}