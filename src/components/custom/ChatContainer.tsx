import React, {useRef, useEffect} from "react";
import ChatBubble from "./ChatBubble";

interface ChatContainerProps {
  messages: { content: string; role: string }[];
  className: string;
}


const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the bottom of chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      //@ts-ignore
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={"chat-container flex-1 flex flex-col " + className}>
      <div className="overflow-auto flex-1 p-4" ref={messagesEndRef}>
        {/* Display Messages */}
        {messages.map((msg, index) => (
            <ChatBubble
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              key={index}
              message={msg.content}
              isReceived={msg.role === "assistant"}
              isHovered={isHovered}
            />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
