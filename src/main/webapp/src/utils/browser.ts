export const getBrowserLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    }
    return navigator.language;
}