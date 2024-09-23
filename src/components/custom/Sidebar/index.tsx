import { Conversation } from "@/types";
import {
  IconFolderPlus,
  IconMessagesOff,
  IconPlus,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import { FC, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Conversations } from "@/components/custom/sidebar/conversations";
import { Folders } from "@/components/custom/sidebar/folders";
import { Search } from "@/components/custom/sidebar/search";
import { ClearConversations } from "@/components/custom/sidebar/clear-conversations";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui";

import "./index.scss";

import { useAppSelector, useAppDispatch } from "@/store";
import { RootState } from "@/store";
import {
  deleteFolder,
  updateFolder,
  toggleSidebar,
} from "@/store/siderbar";

import {
  setSelectedConversation,
  createConversation,
  updateConversationAsync,
  deleteConversation,
} from "@/store/conversation";

export const Sidebar: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("sidebar");

  const { loading, folders } = useAppSelector(
    (state: RootState) => state.sidebar
  );

  const { sidebarOpen } = useAppSelector((state: RootState) => state.sidebar);

  const { conversationList } = useAppSelector(
    (state: RootState) => state.conversation
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredConversations = searchTerm
    ? conversationList.filter((conversation) =>
        conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversationList;

  const conversations = conversationList.map((conversation) => ({
    ...conversation,
    name: conversation.title,
    folderId: 0,
  }));

  const selectedConversation = useAppSelector(
    (state: RootState) => state.conversation.selectedConversation
  );

  const conversationsDivRef = useRef<HTMLDivElement>(null);

  // const _onCreateFolder = (name: string) => dispatch(createFolder(name));

  const onDeleteFolder = (folderId: number) => dispatch(deleteFolder(folderId));

  const onUpdateFolder = (folderId: number, name: string) =>
    dispatch(updateFolder({ id: folderId, name }));

  const onNewConversation = () => dispatch(createConversation());

  const onSelectConversation = (conversation: Conversation) =>
    dispatch(setSelectedConversation(conversation));

  const onDeleteConversation = (conversation: Conversation) =>
    dispatch(deleteConversation(conversation.id));

  const onToggleSidebar = () => {
    console.log("onToggleSidebar", { sidebarOpen });
    dispatch(toggleSidebar());
  };

  const onClearConversations = () => {
    alert("Not implemented");
    // dispatch(clearConversations());
  };

  const handleUpdateConversation = (conversation: Conversation): void => {
    dispatch(updateConversationAsync(conversation));
    setSearchTerm("");
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    onDeleteConversation(conversation);
    setSearchTerm("");
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData("conversation"));
      dispatch(updateConversationAsync(conversation));

      e.target.style.background = "none";
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (_e: any) => {
    if (conversationsDivRef.current) {
      const dropOverlay = document.createElement("div");
      dropOverlay.className = "drop-overlay";
      dropOverlay.style.background = "rgba(0, 0, 0, 0.5)";
      dropOverlay.style.position = "absolute";
      dropOverlay.style.top = "0";
      dropOverlay.style.left = "0";
      dropOverlay.style.width = "100%";
      dropOverlay.style.height = "100%";
    }
  };

  const removeHighlight = (_e: any) => {
    if (conversationsDivRef.current) {
      const overlay = conversationsDivRef.current.querySelector(".overlay");
      if (overlay) {
        overlay.remove();
      }
    }
  };


  return (
    <aside
      className={cn(
        `fixed top-0 bottom-0 z-50 flex h-full w-[260px] flex-none flex-col space-y-2  p-2 transition-all sm:relative sm:top-0`,
        "flex flex-col bg-gray-100 justify-between w-[220px] p-2 pb-4"
      )}
    >
      {/* 会话列表 top toolbar */}
      <header className="flex flex-row justify-between bg-white rounded shadow-sm">
        <div className="flex flex-row justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white"
            onClick={onToggleSidebar}
          >
            <IconLayoutSidebarLeftCollapse size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white"
            onClick={() => {
              alert("Not implemented");
              // onCreateFolder(t("New folder")
            }}
          >
            <IconFolderPlus size={18} />
          </Button>
        </div>
        <div className="flex flex-row items-center pr-2">
          <ClearConversations onClearConversations={onClearConversations} />
        </div>
      </header>
      <Search searchTerm={searchTerm} onSearch={setSearchTerm} />

      <div className="siderbar flex-grow overflow-y-auto overflow-x-clip ">
        {folders.length > 0 && (
          <div className="flex border-b border-white/20 pb-2">
            <Folders
              searchTerm={searchTerm}
              conversations={filteredConversations.filter(
                (conversation) => conversation.folderId !== 0
              )}
              selectedConversation={selectedConversation}
              folders={folders}
              onDeleteFolder={onDeleteFolder}
              onUpdateFolder={onUpdateFolder}
              loading={loading}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onUpdateConversation={handleUpdateConversation}
            />
          </div>
        )}

        {conversations.length > 0 ? (
          <div
            ref={conversationsDivRef}
            className="h-full pt-2"
            onDrop={(e) => handleDrop(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
            onDragEnd={removeHighlight}
          >
            <Conversations
              loading={loading}
              conversations={filteredConversations.filter(
                (conversation) =>
                  conversation.folderId === 0 ||
                  !folders[conversation.folderId - 1]
              )}
              selectedConversation={selectedConversation}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onUpdateConversation={handleUpdateConversation}
            />
          </div>
        ) : (
          <div className="mt-8 text-center opacity-50 select-none">
            <IconMessagesOff className="mx-auto mb-3" />
            <span className="text-[12.5px] leading-3">
              {t("No conversations.")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-center">
        <Button
          size="icon"
          className="w-[80%]"
          onClick={() => {
            onNewConversation();
            setSearchTerm("");
          }}
        >
          <IconPlus size={18} />
          新建会话
        </Button>
      </div>
    </aside>
  );
};
