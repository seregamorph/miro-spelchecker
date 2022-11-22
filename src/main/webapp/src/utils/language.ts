import {getBrowserLanguages, LocalStorageKey, setLocalStorageItem} from "./browser";

export const SUPPORTED_LANGUAGES = [
    {
        value: "en-US",
        label: "English"
    },
    {
        value: "es-ES",
        label: "Spanish"
    },
    {
        value: "de",
        label: "German"
    },
    {
        value: "ru-RU",
        label: "Russian"
    },
    {
        value: "fr-FR",
        label: "French"
    },
    {
        value: "jp-JP",
        label: "Japanese"
    }
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]["value"];

const DEFAULT_LANGUAGE: SupportedLanguage = "en-US";

const isLanguageSupported = (lang?: string): lang is SupportedLanguage => {
    if (!lang) {
        return false;
    }
    return SUPPORTED_LANGUAGES.some(({value}) => value === lang);
};

export const getValidatedLanguage = (languages: string | string[] = getBrowserLanguages()): SupportedLanguage => {
    const langs = typeof languages === "string" ? [languages] : languages;
    const language = langs.find(lang => isLanguageSupported(lang));
    if (isLanguageSupported(language)) {
        return language;
    }
    return DEFAULT_LANGUAGE;
};

export const saveLanguageSelection = (lang: SupportedLanguage) => {
    setLocalStorageItem(LocalStorageKey.Language, lang);
};