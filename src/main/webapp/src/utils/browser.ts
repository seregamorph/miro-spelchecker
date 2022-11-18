export const getBrowserLanguages = (): string[] => {
    if (navigator.languages && navigator.languages.length) {
        return [...navigator.languages];
    }
    return [navigator.language];
}