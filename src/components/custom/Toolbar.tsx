import React from "react";
import { Toggle } from "@/components/ui";

import { Layout } from "@phosphor-icons/react";

import "./Toolbar.scss";

interface ToolbarProps {
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar }) => {
  return (
    <div className="toolbar h-[32px] w-full text-white flex flex-row justify-between items-center px-4">
      <Toggle aria-label="Toggle italic">
        <Layout
          onClick={onToggleSidebar}
          size={16}
          color="var(--primary-color)"
        />
      </Toggle>

      <div />
    </div>
  );
};

export default Toolbar;
