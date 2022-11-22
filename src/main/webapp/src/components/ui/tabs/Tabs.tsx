import { FC } from "react";
import { Tab as TabModel } from "../../../types";
import { Tab } from "./Tab";

interface Props {
  tabs: TabModel[];
  activeTab: string;
  onSelect: (tabId: string) => void;
}

export const Tabs: FC<Props> = ({ tabs, activeTab, onSelect }) => {
  return (
    <div className="tabs">
      <div className="tabs-header-list">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            onSelect={onSelect}
            active={activeTab === tab.id}
          />
        ))}
      </div>
    </div>
  );
};
