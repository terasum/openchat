import React, { useRef, useEffect, useState } from "react";
import ChatBubble from "@/components/custom/chatbox/chat-bubble";
import { Popover } from "@/components/ui/text-selection-popover";
import { lookupWord } from "@/api/app";
import "@/components/custom/chatbox/chat-container.scss";
interface ChatContainerProps {
  messages: { content: string; role: string }[];
  className: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  className,
  messages,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ref, setRef] = useState<HTMLElement>();
  const [lookupText, setLookupText] = useState("");

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
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
    <div
      className={"chat-container flex-1 flex flex-col select-none " + className}
    >
      <div className="overflow-auto flex-1" ref={divRef}>
        {/* Display Messages */}
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.content}
            messageTime={""}
            isReceived={msg.role === "assistant"}
            isLatest={index === messages.length - 1}
            onRetryGenerated={() => {
              console.log("retry generete clicked");
            }}
            parentSize={size}
            setSelectRef={(el) => {
              el != null && setRef(el);
            }}
          />
        ))}
      </div>
      <Popover
        target={ref}
        render={({ clientRect, isCollapsed, textContent }) => {
        
          if (clientRect == null || isCollapsed) return null;
          if (
            !textContent ||
            textContent.length < 2 ||
            textContent.indexOf(" ") != -1
          ) {
            return null;
          }
          lookupWord(textContent).then((result) => {
            const htmlContent = (result as string).replaceAll("d:entry", "div");
            setLookupText(htmlContent as string);
          });

          if (!lookupText || lookupText.length < 2) {
            return null;
          }

          return (
            <>
              <div
                style={{
                  left: clientRect.x,
                  top: clientRect.y + clientRect.height,
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  width: "auto",
                  height: "auto",
                  maxHeight: "240px",
                  maxWidth: "320px",
                  justifyContent: "start",
                }}
              >
                <div
                  style={{
                    content: '""',
                    borderStyle: "solid",
                    borderWidth: "0 10px 10px 10px",
                    // borderColor: "transparent transparent #DCDEDF transparent",
                    borderColor: "transparent transparent #FFF transparent",
                    zIndex: 10,
                    width: "10px",
                    transform: "translate(10px, 0px)",
                    display: "flex",
                  }}
                ></div>
                <div
                  style={{
                    transform: "translate(0, 0px)",
                    boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                    width: "auto",
                    background: "#FFF",
                    borderRadius: "6px",
                    minWidth: "50px",
                    minHeight: "60px",
                    overflow: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <div
                    className="__dictionary_container text-sm text-red"
                    dangerouslySetInnerHTML={{ __html: lookupText }}
                  ></div>
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default ChatContainer;
