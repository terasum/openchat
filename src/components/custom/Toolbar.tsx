import React from "react";
import { Button, Badge } from "@/components/ui";
import SidebarIcon from "@/assets/images/side-bar-fill.svg";
import "./Toolbar.scss";

import { useAppSelector } from "@/hooks/use-state";

interface ToolbarProps {
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar }) => {
  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );
  const model_provider = useAppSelector(
    (state) => state.appConfig.model.model_provider
  );
  return (
    <div className="toolbar w-full text-white flex flex-row justify-start items-center px-4 pt-1 pb-1 select-none">
      <Button
        className="h-[20px] pl-2 pr-2 shadow-none mr-3"
        size="sm"
        variant="outline"
        onClick={onToggleSidebar}
      >
        <img className="w-[14px] h-[14px]" src={SidebarIcon} />
      </Button>

      <div className="flex flex-row items-center cursor-default gap-1">
        <Badge variant="outline">{model_provider}</Badge>
        <Badge variant="outline">{activatedPrompt.title}</Badge>
      </div>

      <div />
    </div>
  );
};

export default Toolbar;
