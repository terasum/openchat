import { FC, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import {
  CopyIcon,
  ExternalLinkIcon,
  UpdateIcon,
  RadiobuttonIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { MarkdownContent } from "./MarkdownContent";
import OpenChatIconSVG from "@/assets/images/robot.svg";
import UserIconSVG from "@/assets/images/user.svg";
import { cn, date_format } from "@/lib/utils";
import { clipboard, dialog } from "@tauri-apps/api";


interface ChatBubbleProps {
  message: string;
  messageTime: string;
  isReceived: boolean;
  isLatest: boolean;
  parentSize: { width: number; height: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onRetryGenerated?: () => void;
  setSelectRef: (ref: HTMLDivElement) => void;
}

async function copyToClipboard(text: string) {
  await clipboard.writeText(text);
  await dialog.message("文本已复制到剪贴板");
}

const ChatBubble: FC<ChatBubbleProps> = ({
  onMouseEnter,
  onMouseLeave,
  message,
  messageTime,
  isReceived,
  isLatest,
  parentSize,
  onRetryGenerated,
  setSelectRef,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const bubbleRef = useRef(null);


  const copyFn = (msg: string) => {
    return () => {
      copyToClipboard(msg);
    };
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Code to handle the mouseup event
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSelectRef(event.currentTarget);
    }
  };

  useEffect(() => {
    if (bubbleRef.current) {
      (bubbleRef.current as HTMLDivElement).style.maxWidth = `${
        0.8 * parentSize.width
      }px`;
    }
  }, [parentSize]);
  return (
    <div
      className={cn(
        `flex w-full items-start my-2 select-none cursor-default`,
        isReceived ? "justify-start" : "justify-end"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* openchat */}
      {isReceived && (
        <Avatar className="w-[24px] h-[24px] mr-2">
          <AvatarImage src={OpenChatIconSVG} alt="@openchat" />
          <AvatarFallback>
            <RadiobuttonIcon color="black" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`select-none`}>
        {isReceived ? (
          <div
            className={cn(
              "p-2 pl-4 pr-4 rounded-lg select-text cursor-text",
              "bg-gray-200 text-black"
            )}
            ref={bubbleRef}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          >
            <MarkdownContent content={message} onMouseUp={handleMouseUp} />
          </div>
        ) : (
          <div className="p-2 rounded-lg select-text cursor-text bg-blue-500 text-white max-w-[480px]">
            <p
              onContextMenu={(e) => {
                e.stopPropagation();
              }}
              onMouseUp={handleMouseUp}
            >
              {message}
            </p>
          </div>
        )}

        {isReceived && (
          <div
            className="flex flex-row justify-between h-[14px] mt-1 z-999"
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          >
            <div className="flex flex-row text-slate-500 text-[12px] mr-2">
              {messageTime
                ? date_format(new Date(Date.parse(messageTime)))
                : ""}
            </div>
            <div
              className={cn(
                "flex flex-row transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <button className="mr-1" onClick={copyFn(message)}>
                <CopyIcon width={14} height={14} />
              </button>

              {isLatest && (
                <button className="ml-1 mr-1" onClick={onRetryGenerated}>
                  <UpdateIcon width={14} height={14} />
                </button>
              )}

              <button className="ml-1 mr-1">
                <ExternalLinkIcon width={14} height={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* user */}
      {!isReceived && (
        <Avatar className="w-[24px] h-[24px] ml-2">
          <AvatarImage src={UserIconSVG} alt="@user" />
          <AvatarFallback>
            <PersonIcon color="black" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
