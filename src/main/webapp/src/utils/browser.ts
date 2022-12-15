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

export const getParentHref = () => {
  try {
    const url = document.referrer;
    return url || "";
  } catch (err) {
    return "";
  }
};
