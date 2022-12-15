import { FC, StrictMode, useCallback, useMemo, useState } from "react";
import cn from "classnames";
import { Tabs } from "../ui/tabs/Tabs";
import { getTabs } from "../../utils/tabs";
import { SelectedElementsChecks } from "../SelectedElementsChecks";
import { BoardChecks } from "../BoardChecks";
import { useSelectedElements } from "../../hooks/useSelectedElements";
import { getValidatedLanguage } from "../../utils/language";
import { voidFn } from "../../utils/common";
import { AppFooter } from "../AppFooter/AppFooter";
import { SettingsPage } from "../SettingsPage/SettingsPage";
import styles from "./App.module.css";

export const App: FC = () => {
  const tabs = useMemo(() => getTabs(), []);
  const [refresh, setRefresh] = useState<VoidFunction>(() => voidFn);
  const [activeTab, setActiveTab] = useState(tabs.length ? tabs[0].id : "");
  const { items: selectedItems, refreshSelection } = useSelectedElements();
  const [language, setLanguage] = useState(getValidatedLanguage);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen((isOpen) => !isOpen),
    []
  );

  const setRefreshHandler = useCallback((fn: VoidFunction) => {
    setRefresh(() => fn);
  }, []);

  const switchToAll = useCallback(() => {
    setActiveTab("total");
  }, []);

  if (!selectedItems) {
    return null;
  }

  return (
    <StrictMode>
      <article className={cn("grid", "grid-container", styles.container)}>
        <header className="cs1 ce12">
          {!settingsOpen && (
            <Tabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />
          )}
        </header>

        <SelectedElementsChecks
          active={activeTab === "selected" && !settingsOpen}
          items={selectedItems}
          refreshSelection={refreshSelection}
          switchToAll={switchToAll}
          onActivate={setRefreshHandler}
          className={cn("cs1", "ce12", styles.wrapper)}
          language={language}
        />
        <BoardChecks
          active={activeTab === "total" && !settingsOpen}
          onActivate={setRefreshHandler}
          className={cn("cs1", "ce12", styles.wrapper)}
          language={language}
        />

        {settingsOpen && (
          <SettingsPage
            className={cn("cs1", "ce12", styles.wrapper)}
            language={language}
            setLanguage={setLanguage}
          />
        )}

        <AppFooter
          reloadResults={refresh}
          settingsOpen={settingsOpen}
          toggleSettings={toggleSettings}
        />
      </article>
    </StrictMode>
  );
};
