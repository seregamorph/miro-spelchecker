import cn from "classnames";
import { FC } from "react";
import { RefreshButton } from "../RefreshButton/RefreshButton";
import { SettingsButton } from "../SettingsButton/SettingsButton";
import styles from "./AppFooter.module.css";

interface Props {
  reloadResults: VoidFunction;
  toggleSettings: VoidFunction;
  settingsOpen: boolean;
}
export const AppFooter: FC<Props> = ({
  reloadResults,
  toggleSettings,
  settingsOpen,
}) => {
  return (
    <footer className={cn("cs1", "ce12", "grid", styles.footer)}>
      <div className={cn("cs1", "ce3", styles.refresh)}>
        <SettingsButton
          onClick={toggleSettings}
          isSettingsShown={settingsOpen}
        />
      </div>
      {!settingsOpen && (
        <div className={cn("cs10", "ce12", styles.refresh)}>
          <RefreshButton onClick={reloadResults} />
        </div>
      )}
    </footer>
  );
};
