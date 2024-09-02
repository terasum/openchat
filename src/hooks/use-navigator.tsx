import { useState } from "react";

import OpenChatIconSVG from "@/assets/images/openchat-flat-nav.svg?react";
import GhostIconSVG from "@/assets/images/ghost.svg?react";
import GearIconSVG from "@/assets/images/gear.svg?react";
import BugIconSVG from "@/assets/images/bug.svg?react";

import { invoke } from "@tauri-apps/api/tauri";

const openDevTool = async () => {
  await invoke("open_devtools");
};

export function useNavigator() {
  const [selectedTab, setSelectedTab] = useState<
    "chat" | "prompt" | "settings" | "debug"
  >("chat");

  const functionTabs = [
    {
      id: "chat",
      label: "Chat",
      icon: OpenChatIconSVG.bind(null, { width: "22", height: "22", fill: "#222" }),
    },
    {
      id: "prompt",
      label: "Prompt",
      icon: GhostIconSVG.bind(null, { width: "22", height: "22", fill: "#222" }),
    },
  ];

  const settingsTabs = [
    {
      id: "debug",
      label: "Debug",
      icon: BugIconSVG.bind(null, { width: "22", height: "22", fill: "#222" }),
    },
    {
      id: "settings",
      label: "Settings",
      icon: GearIconSVG.bind(null, { width: "22", height: "22", fill: "#222" }),
    },
  ];

  const handleSelectTab = async (id: string) => {
    if (id == "debug") {
      await openDevTool();
      return;
    }
    setSelectedTab(id as "chat" | "prompt" | "settings" | "debug");
  };

  return {
    selectedTab,
    functionTabs,
    settingsTabs,
    handleSelectTab,
  };
}
