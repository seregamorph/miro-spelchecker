import {
  getLocalStorageItem,
  isLocalStorageAvailable,
  LocalStorageKey,
} from "./localStorage";

export const getBrowserLanguages = (): string[] => {
  const lang = isLocalStorageAvailable()
    ? getLocalStorageItem(LocalStorageKey.Language)
    : "";
  if (navigator.languages && navigator.languages.length) {
    return lang ? [lang, ...navigator.languages] : [...navigator.languages];
  }
  return lang ? [lang, navigator.language] : [navigator.language];
};
