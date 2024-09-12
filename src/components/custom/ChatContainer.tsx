import React, { useRef, useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";

interface ChatContainerProps {
  messages: { content: string; role: string }[];
  className: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  className,
  messages,
}) => {
  const divRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
        console.log("ResizeObserver", width, height);
      }
    });

    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    // 清理观察者
    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
    };
  }, []);

  // Effect to scroll to the bottom of chat messages
  useEffect(() => {
    if (divRef.current) {
      //@ts-ignore
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={"chat-container flex-1 flex flex-col " + className}>
      <div className="overflow-auto flex-1 p-4" ref={divRef}>
        {/* Display Messages */}
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.content}
            messageTime={""}
            isReceived={msg.role === "assistant"}
            parentSize={size}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
