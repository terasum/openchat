import { Sidebar } from "@/components/custom/Sidebar/sidebar";
import { ChatBox } from "@/components/custom/ChatBox";
import { useAppSelector, RootState } from "@/store";
import { useMemo, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/store";
import { fetchConversations } from "@/store/conversation";

const Chat: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state: RootState) => state.sidebar);
  console.log("showSidebar", { sidebarOpen });
  const dispatch = useAppDispatch();

  const fetchConversationsCallback = useCallback(() => {
    dispatch(fetchConversations());
  }, []);

  useEffect(() => {
    fetchConversationsCallback();
  }, [fetchConversationsCallback]);

  return (
    <div className="flex flex-row justify-between w-full h-full overflow-hidden">
      {/* Middle Sidebar for Conversations */}
      {sidebarOpen && <Sidebar />}
      {/* Right-side Chat Container */}
      <ChatBox />
    </div>
  );
};

export default Chat;
