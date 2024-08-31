import "@/styles/global.css";
import "@/styles/components.css";
import React, { useState, useEffect } from "react";
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
import { wrapGetSessionList, Session } from "./bindings-v2";

interface Conversation {
  id: string;
  title: string;
  messages: string[];
}

const openDevTool = async () => {
  await invoke("open_devtools");
};

const ChatInterface: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "0",
      title: "如果我fork了一个项目...",
      messages: [
        "请问有什么可以帮您的吗？",
        "请问如何处理MDX文档?",
        MarkdownDemoData(),
      ],
    },
  ]);

  const tabs = [
    { id: 0, label: "Chat", icon: ChatCircleDots },
    { id: 1, label: "Contacts", icon: MaskHappy },
  ];

  const settingsTabs = [
    { id: 2, label: "Report a Bug", icon: Bug },
    { id: 3, label: "Settings", icon: Gear },
  ];

  function getMessage(): string[] {
    const selected = conversations.filter((conversation) => {
      return conversation.id == selectedConversation;
    });
    
    if (selected.length <= 0) {
      return ["有什么可以帮您的吗?"];
    }

    const messages = selected[0].messages.map((message) => {
      return message;
    });

    return messages.length > 0 ? messages : ["有什么可以帮您的吗?"];
  }

  const handleSelectTab = async (id: number) => {
    if (id == 2) {
      await openDevTool();
      return;
    }
    setSelectedTab(id);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = (message: string) => {
    // const updatedConversations = [...conversations];
    // updatedConversations[selectedConversation].messages.push(message);
    // setConversations(updatedConversations);
  };

  useEffect(() => {
    wrapGetSessionList(0, 10).then((res) => {
      console.log("============ wrapGetSessionList ======== ");
      if (res && res instanceof Array) {
        const sessionList = res as unknown as Session[];
        const conversationList = sessionList.map((session) => {
          console.log("session: ", session);
          console.log("session id", session.id);
          return {
            id: session.id,
            title: session.title,
            messages: [] as string[],
          };
        });
        conversationList.push({
          id: "0",
          title: "demo",
          messages: [
            "请问有什么可以帮您的吗？",
            "请问如何处理MDX文档?",
            MarkdownDemoData(),
          ],
        });
        setConversations(conversationList);
        setSelectedConversation(conversationList[0].id);
      } else {
        console.error(res as unknown as string);
      }
    });
  }, []);

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
                onToggleSidebar={() => {
                  alert("toggle");
                }}
              ></Toolbar>
              <ChatContainer
                className="h-[calc(100%-100px)]"
                messages={getMessage()}
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
