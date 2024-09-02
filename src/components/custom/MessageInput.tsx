import React, { useState } from "react";
import { Button } from "@/components/ui";
import { Textarea } from "../ui/textarea";
import UpArrowIcon from "@/assets/images/up-arrow.svg?react";
import StopIcon from "@/assets/images/stop.svg?react";
import { isWithinTokenLimit } from "gpt-tokenizer";

interface MessageInputProps {
  onSend: (message: string) => void;
  stopResponsing: () => void;
  isResponsing: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  stopResponsing,
  isResponsing,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [tokenUsage, setTokenUsage] = useState<number>(0);
  const [isInTokenLimit, setIsInTokenLimit] = useState<boolean>(true);

  const handleSendMessage = () => {
    console.log("handle SendMessage, ", inputValue);
    setTokenUsage(0);
    if (inputValue.trim() !== "") {
      onSend(inputValue);
      setInputValue("");
    } else {
      isResponsing && stopResponsing();
    }
  };

  const handleInputValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "") {
      setIsInTokenLimit(true);
      setTokenUsage(0);
      return;
    }

    const actualTokensNum = isWithinTokenLimit(newValue, 2000);
    if (actualTokensNum) {
      setTokenUsage(actualTokensNum);
      setIsInTokenLimit(true);
    } else {
      setIsInTokenLimit(false);
    }
  };

  const handleKeyEnterDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-start m-4 ">
      <div className="grid w-full gap-1.5">
        <Textarea
          value={inputValue}
          onChange={handleInputValueChange}
          placeholder="有什么问题尽管问我"
          className="flex-1 p-2 border rounded-md min-h-[32px] text-[12px] resize-none overflow-y-scroll"
          rows={1}
          onKeyDown={handleKeyEnterDown}
        />
        <p className="text-[11px] p-0 text-muted-foreground">
          Token Usage: {isInTokenLimit ? tokenUsage : "2000+"} / 2000
        </p>
      </div>
      {!isResponsing ? (
        <Button
          onClick={handleSendMessage}
          className="flex flex-row justify-center items-center w-[36px] h-[32px] ml-2 p-0 rounded-full text-[32px] bg-gray-700"
        >
          <UpArrowIcon fill="#fff" width={20} height={20} />
        </Button>
      ) : (
        <Button
          onClick={stopResponsing}
          className="flex flex-row justify-center items-center w-[36px] h-[32px] ml-2 p-0 rounded-full text-[32px] bg-gray-700"
        >
          <StopIcon className="animate-pulse animate-infinite" fill="#fff" width={20} height={20} />
        </Button>
      )}
    </div>
  );
};

export default MessageInput;
