import React from "react";
import { Input, Button } from "@/components/ui";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import "./Siderbar.scss";

interface SidebarProps {
  conversations: { id: string; title: string; messages:  { role: string; content: string }[] }[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}) => {
  return (
    <div className="sidebar flex flex-col bg-gray-100 justify-between w-[200px] p-2 pb-4">
      <div className="flex flex-col h-[calc(100%-40px)]">
        <div className="flex w-full items-center mb-2">
          <Input className="bg-white" type="text" placeholder="搜索会话" />
        </div>

        <div className="flex flex-col w-full overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex flex-col w-full"
            >
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`text-left mt-1 mb-1 p-2 pl-4 pr-4 truncate overflow-hidden flex flex-col items-start gap-2 rounded-lg border text-sm transition-all hover:bg-accent ${
                  selectedConversation === conversation.id
                    ? "bg-muted"
                    : "bg-white"
                }`}
              >
                {conversation.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full justify-center items-center">
        <Button className="w-[90%]" variant={"outline"}>
          <PlusCircledIcon />
          新建会话
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
