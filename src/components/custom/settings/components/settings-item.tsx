import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface SettingsItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function SettingsItem(props: SettingsItemProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-4 rounded-md border p-4 h-[60px] cursor-default",
        props.disabled && "opacity-50 pointer-events-none",
        props.className
      )}
    >
      <props.icon color="#505050" size={20}  />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{props.title}</p>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
      {props.children}
    </div>
  );
}
