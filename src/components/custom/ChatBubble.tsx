import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { CopyIcon, ExternalLinkIcon, UpdateIcon, RadiobuttonIcon, PersonIcon } from "@radix-ui/react-icons";
import { MarkdownContent } from "./MarkdownContent";
import OpenChatIconSVG from "@/assets/images/robot.svg";
import UserIconSVG from "@/assets/images/user.svg";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isReceived: boolean;
  isHovered: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  onMouseEnter,
  onMouseLeave,
  message,
  isReceived,
  isHovered,
}) => {
  return (
    <div
      className={`flex w-mx-lg ${
        isReceived ? "justify-start" : "justify-end"
      } items-start my-2`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isReceived && (
        <Avatar className="w-[24px] h-[24px] mr-2">
          <AvatarImage src={OpenChatIconSVG} alt="@openchat" />
          <AvatarFallback>
            <RadiobuttonIcon color="black" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`p-2 rounded-lg max-w-96 ${
          isReceived ? "bg-gray-200 text-black" : "bg-blue-500 text-white"
        }`}
      >
        {isReceived ? (
          <MarkdownContent content={message} />
        ) : (
          <div>{message}</div>
        )}

        {isReceived && (
          <div className="flex flex-row justify-start h-[12px] mt-1">
            <div
              className={cn(
                "flex flex-row transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <button className="mr-1 ">
                <CopyIcon width={12} height={12} />
              </button>

              <button className="ml-1 mr-1">
                <UpdateIcon width={12} height={12} />
              </button>

              <button className="ml-1 mr-1">
                <ExternalLinkIcon width={12} height={12} />
              </button>
            </div>
          </div>
        )}
      </div>

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
