import "@/styles/global.css";
import "@/styles/components.css";

import React from "react";
import TabNavigation from "@/components/custom/TabNavigation";

import TabPrompts from "@/TabPrompts";
import TabChat from "@/TabChat";
import GearPage from "@/TabSettings";

import { useNavigator } from "@/hooks/use-navigator";
const ChatInterface: React.FC = () => {
  const { selectedTab, functionTabs, settingsTabs, handleSelectTab } =
    useNavigator();

  return (
    <div className="flex flex-row w-full h-full">
      {/* Left-side Tab Navigation */}
      <div className="left-side-bar w-[40px] h-full">
        <TabNavigation
          functionTabs={functionTabs}
          settingsTabs={settingsTabs}
          selectedTab={selectedTab}
          onSelectTab={handleSelectTab}
        />
      </div>

      <div className="main-area flex flex-row w-[calc(100%-40px)] h-screen">
        {selectedTab === "chat" && <TabChat />}
        {selectedTab === "prompt" && <TabPrompts />}
        {selectedTab === "settings" && <GearPage />}
      </div>
    </div>
  );
};

export default ChatInterface;
