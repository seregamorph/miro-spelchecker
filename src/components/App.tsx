import {FC, StrictMode, useCallback, useMemo, useState} from 'react';
import cn from 'classnames';
import {Tabs} from "./ui/tabs/Tabs";
import {getTabs} from "../utils/tabs";
import {SelectedElementsChecks} from "./SelectedElementsChecks";
import {BoardChecks} from "./BoardChecks";
import {useSelectedElements} from "../hooks/useSelectedElements";
import styles from './App.module.css';

export const App: FC = () => {
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState(0)
    const tabs = useMemo(() => getTabs(total, selected), [total, selected]);
    const [activeTab, setActiveTab] = useState(tabs.length ? tabs[0].id : '');
    const [selectedItems, setSelectedItems] = useSelectedElements();

    const switchToAll = useCallback(() => {
        setActiveTab('total')
    }, []);

    if (!selectedItems) {
        return null;
    }

    return (
        <StrictMode>
            <article className={`grid grid-container ${styles.container}`}>
                <header className="cs1 ce12">
                    <Tabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab}/>
                </header>
                <div className={cn("cs1", "ce12", styles.wrapper)}>
                    <SelectedElementsChecks
                        active={activeTab === 'selected'}
                        onChange={setSelected}
                        items={selectedItems}
                        setItems={setSelectedItems}
                        switchToAll={switchToAll}
                    />
                    <BoardChecks
                        active={activeTab === 'total'}
                        onChange={setTotal} />
                </div>
            </article>
        </StrictMode>
    );
};
