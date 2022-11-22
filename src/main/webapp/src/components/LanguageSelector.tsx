import { ChangeEvent, FC, useCallback } from "react";
import {
  getValidatedLanguage,
  saveLanguageSelection,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "../utils/language";

interface Props {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}
export const LanguageSelector: FC<Props> = ({ language, setLanguage }) => {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const lang = getValidatedLanguage(event.target.value);
      setLanguage(lang);
      saveLanguageSelection(lang);
    },
    [setLanguage]
  );

  return (
    <>
      <label htmlFor="language-selector" className="p-small">
        Language
      </label>
      <select
        className="select select-small"
        id="language-selector"
        value={language}
        onChange={onChange}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </>
  );
};
