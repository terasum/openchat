import React, { useEffect } from "react";
import Sidebar from "@/components/custom/Siderbar";
import ChatContainer from "@/components/custom/ChatContainer";
import MessageInput from "@/components/custom/MessageInput";
import Toolbar from "@/components/custom/Toolbar";

import { useSidebar } from "@/hooks/use-sidebar";
import { useConversation } from "@/hooks/use-conversation";

const Chat: React.FC = () => {
  const { showSidebar, handleToggleSidebar } = useSidebar();

  const {
    initConvers,
    conversations,
    selectedConversation,
    isResponsing,
    handleSelectConversation,
    handleCreateConversation,
    handleDeleteConversation,
    handleSendMessage,
    handleStopResponsing,
    getConvMessage,
  } = useConversation();

  useEffect(() => {
    initConvers();
  }, []);


  
  return (
    <div className="flex flex-row justify-between w-full h-full overflow-hidden">
      {/* Middle Sidebar for Conversations */}
      {showSidebar && (
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onCreateNewConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      )}

      {/* Right-side Chat Container */}
      <div className="flex-1 flex-col h-full justify-between">
        <Toolbar
          onToggleSidebar={() => {
            handleToggleSidebar();
          }}
        ></Toolbar>
        <ChatContainer
          className="h-[calc(100vh-110px)]"
          messages={getConvMessage()}
        />
        <MessageInput
          onSend={handleSendMessage}
          stopResponsing={handleStopResponsing}
          isResponsing={isResponsing}
        />
      </div>
    </div>
  );
};

export default Chat;
