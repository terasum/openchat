import "@/styles/global.css";
import "@/styles/components.css";

import React from "react";
import TabNavigation from "@/components/custom/TabNavigation";

import TabPrompt from "@/TabPrompt";
import SettingsProfilePage from "@/components/custom/settings/settings";
import TabChat from "@/TabChat";

import { useAppSelector } from "@/hooks/use-state";
import { currentTab } from "./store/navigator";

const ChatInterface: React.FC = () => {
  const selectedTabState = useAppSelector(currentTab);

  return (
    <div className="flex flex-row w-full h-full">
      {/* Left-side Tab Navigation */}
      <div className="left-side-bar w-[40px] h-full">
        <TabNavigation />
      </div>

      <div className="main-area flex flex-row flex-1">
        {selectedTabState === "chat" && <TabChat />}
        {selectedTabState === "prompt" && <TabPrompt />}
        {selectedTabState === "settings" && <SettingsProfilePage />}
      </div>
    </div>
  );
};

export default ChatInterface;
