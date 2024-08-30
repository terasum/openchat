import React from "react";
import { Icon } from "@phosphor-icons/react";
import "./TabNavigation.scss";

interface TabNavigationProps {
  tabs: { id: number; label: string; icon?: Icon }[];
  settingsTabs: { id: number; label: string; icon?: Icon }[];
  selectedTab: number;
  onSelectTab: (id: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  settingsTabs,
  selectedTab,
  onSelectTab,
}) => {
  return (
    <div className="tab-navigation h-full bg-gray-800 text-white flex flex-col items-center">
      <div className="nav-func">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`w-full flex flex-col items-center justify-center ${
              selectedTab === tab.id ? "bg-gray-700" : "bg-gray-800"
            } hover:bg-blue-700`}
          >
            {tab.icon ? (
              React.createElement(tab.icon, {
                size: 24,
                weight: "fill",
              })
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        ))}
      </div>
      <div className="nav-settings">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`w-full flex flex-col items-center justify-center text-white ${
              selectedTab === tab.id ? "bg-gray-700" : "bg-gray-800"
            } hover:bg-blue-700`}
          >
            {tab.icon ? (
              React.createElement(tab.icon, {
                size: 24,
                weight: "fill",
              })
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
