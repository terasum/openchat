import React from "react";
import ChatBubble from "./ChatBubble";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  messages: { content: string; role: string }[];
  className: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  className,
}) => {
  return (
    <div className={"chat-container flex-1 flex flex-col " + className}>
      <div className="overflow-auto flex-1 p-4">
        {/* Display Messages */}
        {messages.map((msg, index) => (
            <ChatBubble
              key={index}
              message={msg.content}
              isReceived={msg.role === "assistant"}
            />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
