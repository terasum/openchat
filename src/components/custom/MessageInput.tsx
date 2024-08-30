import React, { useState } from 'react';
import {Input, Button} from "@/components/ui"
import {PaperPlaneTilt} from "@phosphor-icons/react"

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex items-center m-4">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="有什么问题尽管问我"
        className="flex-1 p-2 border rounded-md"
      />
      <Button
        onClick={handleSendMessage}
        className="ml-2 p-2 pl-6 pr-6"
      >
        <PaperPlaneTilt size={16} weight='fill' /> &nbsp;
      </Button>
    </div>
  );
};

export default MessageInput;
