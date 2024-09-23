import Toolbar from "@/components/custom/chatbox/chat-toolbar";
import ChatContainer from "@/components/custom/chatbox/chat-container";
import MessageInput from "@/components/custom/chatbox/message-input";
import { useAppDispatch, useAppSelector } from "@/store";
import { sendMessage, setIsResponsing } from "@/store/conversation";

export const ChatBox = () => {
  const dispatch = useAppDispatch();


  const messages = useAppSelector((state) => state.conversation.currentMsgList);
  const isResponsing = useAppSelector(
    (state) => state.conversation.isResponsing
  );
  const handleSendMessage = (message: string) => dispatch(sendMessage(message));

  const handleStopResponsing = () => dispatch(setIsResponsing(false));

  return (
    <div className="flex-1 flex-col h-full justify-between">
      <Toolbar/>

      <ChatContainer
        className="h-[calc(100vh-160px)]"
        messages={messages.map(msg => ({ content: msg.message, role: msg.role }))}
      />
      <MessageInput
        onSend={handleSendMessage}
        stopResponsing={handleStopResponsing}
        isResponsing={isResponsing}
      />
    </div>
  );
};
