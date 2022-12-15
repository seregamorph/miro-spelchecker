import { FC } from "react";
import cn from "classnames";
import { LanguageSelector } from "../LanguageSelector";
import { SupportedLanguage } from "../../utils/language";
import { isLocalStorageAvailable } from "../../utils/localStorage";
import styles from "./SettingsPage.module.css";
import { FeedbackButton } from "../FeedbackButton/FeedbackButton";

interface Props {
  className: string;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}
export const SettingsPage: FC<Props> = ({
  language,
  setLanguage,
  className,
}) => {
  const canStoreLanguage = isLocalStorageAvailable();
  return (
    <div className={className}>
      <p>
        <LanguageSelector language={language} setLanguage={setLanguage} />
        {!canStoreLanguage && (
          <span className={cn("p-small", styles.warning)}>
            Language selection will reset after you close the application
          </span>
        )}
      </p>
      <div className={styles.section}>
        <p>
          <span className="p-small">Have something to say?</span>
        </p>
        <p>
          <FeedbackButton />
        </p>
      </div>
    </div>
  );
};
