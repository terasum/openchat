import React from "react";
import { Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from "@/components/ui";
import SidebarIcon from "@/assets/images/side-bar-fill.svg"

import "./Toolbar.scss";

interface ToolbarProps {
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar }) => {
  return (
    <div className="toolbar w-full text-white flex flex-row justify-start items-center px-4 pt-1 pb-1">
      <Button className="h-[20px] pl-2 pr-2 shadow-none mr-3"  size="sm" variant="outline" onClick={onToggleSidebar}>
        <img className="w-[14px] h-[14px]" src={SidebarIcon}/>
      </Button>

      <Select>
      <SelectTrigger className="w-[120px] h-[20px] pl-2 pr-2 shadown-none text-black text-[12px]">
        <SelectValue className="shadown-none" placeholder="gpt-4o-mini" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className="text-black text-[12px]" value="gpt-4o-mini">gpt-4o-mini</SelectItem>
          <SelectItem disabled className="text-black text-[12px]" value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

      <div />
    </div>
  );
};

export default Toolbar;
