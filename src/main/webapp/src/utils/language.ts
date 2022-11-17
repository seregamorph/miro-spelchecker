import {getBrowserLanguage} from "./browser";

export const SUPPORTED_LANGUAGES = [
    {
        value: 'en-US',
        label: 'English'
    },
    {
        value: 'nl-NL',
        label: 'Dutch'
    }
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['value'];

const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

const isLanguageSupported = (lang: string): lang is SupportedLanguage => {
    return SUPPORTED_LANGUAGES.map(({value}) => value).some(supportedLang => supportedLang === lang);
}

export const getValidatedLanguage = (lang = getBrowserLanguage()): SupportedLanguage => {
    if (isLanguageSupported(lang)) {
        return lang;
    }

    return DEFAULT_LANGUAGE;
}