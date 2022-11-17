import {FC, StrictMode, useCallback, useMemo, useState} from 'react';
import cn from 'classnames';
import {Tabs} from "./ui/tabs/Tabs";
import {getTabs} from "../utils/tabs";
import {SelectedElementsChecks} from "./SelectedElementsChecks";
import {BoardChecks} from "./BoardChecks";
import {useSelectedElements} from "../hooks/useSelectedElements";
import styles from './App.module.css';
import {LanguageSelector} from "./LanguageSelector";
import {RefreshButton} from "./RefreshButton";

export const App: FC = () => {
    const tabs = useMemo(() => getTabs(), []);
    const [refresh, setRefresh] = useState<() => void>(() => () => {});
    const [activeTab, setActiveTab] = useState(tabs.length ? tabs[0].id : '');
    const [selectedItems, setSelectedItems] = useSelectedElements();

    const setRefreshHandler = useCallback((fn: () => void) => {
        setRefresh(() => fn)
    }, [])

    const switchToAll = useCallback(() => {
        setActiveTab('total')
    }, []);

    if (!selectedItems) {
        return null;
    }

    return (
        <StrictMode>
            <article className={cn("grid", "grid-container", styles.container)}>
                <header className="cs1 ce12">
                    <Tabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab}/>
                </header>
                <SelectedElementsChecks
                    active={activeTab === 'selected'}
                    items={selectedItems}
                    setItems={setSelectedItems}
                    switchToAll={switchToAll}
                    onActivate={setRefreshHandler}
                    className={cn("cs1", "ce12", styles.wrapper)}
                />
                <BoardChecks
                    active={activeTab === 'total'}
                    onActivate={setRefreshHandler}
                    className={cn("cs1", "ce12", styles.wrapper)}/>

                <footer className={cn("cs1","ce12", "grid", styles.footer)}>
                    <p className="cs1 ce9">
                        <LanguageSelector />
                    </p>
                    <div className="cs10 ce12 align-self-end">
                        <RefreshButton onClick={refresh}/>
                    </div>
                </footer>
            </article>
        </StrictMode>
    );
};
