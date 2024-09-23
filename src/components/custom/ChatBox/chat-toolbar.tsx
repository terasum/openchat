import React from "react";
import { Button, Badge } from "@/components/ui";
import {
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react";
import "@/components/custom/chatbox/chat-toolbar.scss";
import { toggleSidebar } from "@/store/siderbar";

import { useAppSelector, useAppDispatch } from "@/store";


const Toolbar: React.FC= () => {
  const dispatch = useAppDispatch();
  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );
  const {sidebarOpen} = useAppSelector(
    (state) => state.sidebar
  );

  const model_provider = useAppSelector(
    (state) => state.appConfig.model.model_provider
  );

  return (
    <div className="toolbar w-full h-[36px] mt-2  gap-2 flex flex-row justify-start items-center select-none">
       {!sidebarOpen && <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 ml-2"
        onClick={() => dispatch(toggleSidebar())}
      >
        <IconLayoutSidebarRightCollapse size={18} />
      </Button>}

      <div className="flex flex-row items-center cursor-default gap-1 h-[30px] ml-2">
        <Badge variant="outline">{model_provider}</Badge>
        <Badge variant="outline">{activatedPrompt.title}</Badge>
      </div>

      <div />
    </div>
  );
};

export default Toolbar;
