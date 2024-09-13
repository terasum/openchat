import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui";
import SidebarIcon from "@/assets/images/side-bar-fill.svg";
import { usePrompt } from "@/hooks/use-prompts";
import "./Toolbar.scss";

interface ToolbarProps {
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar }) => {
  const { query } = usePrompt();
  const { data } = query;

  const [state, setState] = useState({
    title: "",
  });

  useEffect(() => {
    const prompt = data?.find((p) => p.actived);
    if (prompt) {
      setState({
        title: prompt.title,
      });
    }
  }, [data]);

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

      <div className="flex flex-row items-center cursor-default">
        <Badge variant="outline">{state.title}</Badge>
      </div>

      <div />
    </div>
  );
};

export default Toolbar;
