import "@/styles/global.css";
import "@/styles/components.css";

import React from "react";
import TabNavigation from "@/components/custom/TabNavigation";

import TabPrompt from "@/TabPrompt";
import SettingsProfilePage from "@/components/custom/settings/settings";
import TabChat from "@/TabChat";

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

      <div className="main-area flex flex-row flex-1">
        {selectedTab === "chat" && <TabChat />}
        {selectedTab === "prompt" && <TabPrompt />}
        {selectedTab === "settings" && <SettingsProfilePage />}
      </div>
    </div>
  );
};

export default ChatInterface;
