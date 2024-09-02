import React, { SVGAttributes } from "react";
import "./TabNavigation.scss";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  functionTabs: { id: string; label: string; icon?: React.FunctionComponent }[];
  settingsTabs: { id: string; label: string; icon?: React.FunctionComponent }[];

  selectedTab: string;
  onSelectTab: (id: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  functionTabs,
  settingsTabs,
  selectedTab,
  onSelectTab,
}) => {
  return (
    <div className="tab-navigation h-full bg-[#E9E9E9] text-gray-700 flex flex-col items-center">
      <div className="nav-func">
        {functionTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              `w-full flex flex-col items-center justify-center rounded-lg p-1  mb-2 cursor-pointer `,
              selectedTab === tab.id ? "bg-gray-300" : "",
              "hover:bg-gray-300"
            )}
          >
            {tab.icon ? <tab.icon /> : <span>{tab.label}</span>}
          </div>
        ))}
      </div>

      <div className="nav-settings">
        {settingsTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              `w-full flex flex-col items-center justify-center rounded-lg p-1  mb-2 cursor-pointer `,
              selectedTab === tab.id ? "bg-gray-300" : "",
              "hover:bg-gray-300"
            )}
          >
            {tab.icon ? <tab.icon /> : <span>{tab.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
