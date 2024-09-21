import React from "react";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import "./Siderbar.scss";
import { Input, Button } from "@/components/ui";

import { ask } from "@tauri-apps/api/dialog";

import { Conversation } from "@/model";

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onCreateNewConversation,
  onDeleteConversation,
}) => {
  const [searchKey, setSearchKey] = React.useState("");
  return (
    <div className="sidebar flex flex-col bg-gray-100 justify-between w-[200px] p-2 pb-4">
      <div className="flex flex-col h-[calc(100%-40px)]">
        <div className="flex w-full items-center mb-2">
          <Input
            className="bg-white"
            type="text"
            placeholder="搜索会话"
            value={searchKey}
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full overflow-y-auto">
          {conversations
            .filter((conversation) => {
              return conversation.title
                .toLowerCase()
                .includes(searchKey.toLowerCase());
            })
            .map((conversation) => (
              <div key={conversation.id} className="flex flex-col w-full">
                <div
                  key={conversation.id}
                  onClick={() => {
                    console.log(`Siderbar.tsx on-click ${conversation.id}`);
                    onSelectConversation(conversation.id);
                  }}
                  className={`text-left mt-1 mb-1 p-2 pl-4 pr-4 truncate overflow-hidden flex flex-row  justify-between gap-2 rounded-lg border text-sm transition-all hover:bg-accent cursor-default ${
                    selectedConversation === conversation.id
                      ? "bg-muted"
                      : "bg-white"
                  }`}
                >
                  <span className="max-w-[calc(100%-30px)] text-ellipsis overflow-hidden">
                    {conversation.title}
                  </span>
                  <div className="flex flex-row h-full w-[15px] bg-red items-center">
                    {/* <span className="rounded-sm hover:bg-slate-300 p-[1px] w-[18px] h-[18px] ml-[2px] cursor-pointer">
                    <Pencil2Icon fill="bold" />
                  </span> */}
                    <span
                      className="rounded-sm hover:bg-slate-300 p-[1px] w-[18px] h-[18px] ml-[2px] cursor-pointer"
                      onClick={async () => {
                        const sure = await ask("确定删除会话？", {
                          title: "删除会话",
                          type: "warning",
                        });
                        if (sure) {
                          onDeleteConversation(conversation.id);
                        }
                      }}
                    >
                      <TrashIcon />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex w-full justify-center items-center">
        <Button
          className="w-[90%]"
          variant={"outline"}
          onClick={() => onCreateNewConversation()}
        >
          <PlusCircledIcon />
          新建会话
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
