import OpenChatIconSVG from "@/assets/images/openchat-flat-nav.svg?react";
import GhostIconSVG from "@/assets/images/ghost.svg?react";
import GearIconSVG from "@/assets/images/gear.svg?react";
import BugIconSVG from "@/assets/images/bug.svg?react";

import React from "react";
import "./TabNavigation.scss";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import {
  currentTab,
  selectTab,
  functionTabs,
  settingsTabs,
  openDevTool,
} from "@/store/navigator";

const TabNavigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTabState = useAppSelector(currentTab);
  const functionTabsState = useAppSelector(functionTabs);
  const settingsTabsState = useAppSelector(settingsTabs);
  const onSelectTab = (tabId: string) => {
    if (tabId == "debug") {
      dispatch(openDevTool());
      return;
    }
    dispatch(selectTab(tabId));
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "debug":
        return <BugIconSVG fill="#222" width={"22"} height={"22"} />;
      case "chat":
        return <OpenChatIconSVG fill="#222" width={"22"} height={"22"} />;
      case "prompt":
        return <GhostIconSVG fill="#222" width={"22"} height={"22"} />;
      case "settings":
        return <GearIconSVG fill="#222" width={"22"} height={"22"} />;
      default:
        return <span>{iconType}</span>;
    }
  };

  return (
    <div className="tab-navigation h-full bg-[#E9E9E9] text-gray-700 flex flex-col items-center">
      <div className="nav-func">
        {functionTabsState.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              `w-full flex flex-col items-center justify-center rounded-lg p-1  mb-2 cursor-pointer `,
              selectedTabState === tab.id ? "bg-gray-300" : "",
              "hover:bg-gray-300"
            )}
          >
            {tab.id ? renderIcon(tab.id) : <span>{tab.label}</span>}
          </div>
        ))}
      </div>

      <div className="nav-settings">
        {settingsTabsState.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              `w-full flex flex-col items-center justify-center rounded-lg p-1  mb-2 cursor-pointer `,
              selectedTabState === tab.id ? "bg-gray-300" : "",
              "hover:bg-gray-300"
            )}
          >
            {tab.id ? renderIcon(tab.id) : <span>{tab.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
