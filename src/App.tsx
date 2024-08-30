import "@/styles/global.css";
import "@/styles/components.css";
import React, { useState } from "react";
import Sidebar from "@/components/custom/Siderbar";
import ChatContainer from "@/components/custom/ChatContainer";
import MessageInput from "@/components/custom/MessageInput";
import TabNavigation from "@/components/custom/TabNavigation";
import Toolbar from "@/components/custom/Toolbar";

import { ChatCircleDots, MaskHappy, Gear, Bug } from "@phosphor-icons/react";

import PromptsPage from "./PromptsPage";
import GearPage from "./SettingsPage";

import { invoke } from "@tauri-apps/api/tauri";

import { MarkdownDemoData } from "./lib/data/markdown-demo";

interface Conversation {
  id: number;
  title: string;
  messages: string[];
}

const openDevTool = async () => {
  await invoke("open_devtools");
};

const ChatInterface: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedConversation, setSelectedConversation] = useState<number>(0);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 0,
      title: "如果我fork了一个项目...",
      messages: [
        "请问有什么可以帮您的吗？",
        "请问如何处理MDX文档?",
        MarkdownDemoData(),
      ],
    },
    {
      id: 1,
      title: "如果我fork了一个项目...",
      messages: ["需要进一步的帮助吗？"],
    },
    { id: 2, title: "处理机器人采...", messages: ["请描述您遇到的问题。"] },
    { id: 3, title: "处理机器人采...", messages: ["请描述您遇到的问题。"] },
    { id: 4, title: "处理机器人采...", messages: ["请描述您遇到的问题。"] }
  ]);

  const tabs = [
    { id: 0, label: "Chat", icon: ChatCircleDots },
    { id: 1, label: "Contacts", icon: MaskHappy },
  ];

  const settingsTabs = [
    { id: 2, label: "Report a Bug", icon: Bug },
    { id: 3, label: "Settings", icon: Gear },
  ];

  const handleSelectTab = async (id: number) => {
    if (id == 2) {
      await openDevTool();
      return;
    }
    setSelectedTab(id);
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = (message: string) => {
    const updatedConversations = [...conversations];
    updatedConversations[selectedConversation].messages.push(message);
    setConversations(updatedConversations);
  };

  return (
    <div className="flex flex-row w-full h-full">
      {/* Left-side Tab Navigation */}
      <div className="left-side-bar w-[40px] h-full">
      <TabNavigation
        tabs={tabs}
        settingsTabs={settingsTabs}
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
      />
      </div>
     
      <div className="main-area flex flex-row w-[calc(100%-40px)] h-screen">
      {/* Render Sidebar or Settings Page based on selectedTab */}
      {selectedTab === 0 && (
        <>
          {/* Middle Sidebar for Conversations */}
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />

          {/* Right-side Chat Container */}
          <div className="flex-1 flex flex-col">
            <Toolbar
              onToggleSidebar={() => {alert("toggle")}}
            ></Toolbar>
            <ChatContainer className="h-[calc(100%-100px)]"
              messages={conversations[selectedConversation].messages}
            />
            <MessageInput onSend={handleSendMessage} />
          </div>
        </>
      )}
      {/* Render Settings Page */}
      {selectedTab === 1 && <PromptsPage />}
      {selectedTab === 3 && <GearPage />}
      </div>
    </div>
  );
};

export default ChatInterface;
