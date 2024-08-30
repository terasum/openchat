import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { CopyIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { MarkdownContent } from "./MarkdownContent";
import { User, Robot } from "@phosphor-icons/react";

interface ChatBubbleProps {
  message: string;
  isReceived: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isReceived }) => {
  return (
    <div
      className={`flex w-mx-lg ${
        isReceived ? "justify-start" : "justify-end"
      } items-start my-2`}
    >
      {isReceived && (
        <Avatar className="w-8 h-8 mr-2">
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>
            <Robot color="black" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`p-2 rounded-lg max-w-96 ${
          isReceived ? "bg-gray-200 text-black" : "bg-blue-500 text-white"
        }`}
      >
          {isReceived && (
        <div className="flex flex-row justify-end h-[20px] ">
          <button className="mr-1"> <CopyIcon/> </button>
          <button className="ml-1"> <ExternalLinkIcon/> </button>
          </div>)}


        {isReceived ? (
          <MarkdownContent content={message} />
        ) : (
          <div>{message}</div>
        )}
      </div>

      {!isReceived && (
        <Avatar className="w-8 h-8 ml-2">
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>
            <User color="black" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
