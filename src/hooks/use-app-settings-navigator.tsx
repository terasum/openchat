import {
  LucideIcon,
  Brain,
  AppWindow,
  CircleHelp,
  Key,
} from "lucide-react";

import { atom, useAtom } from "jotai";

declare type LinkItem = {
  id: number;
  title: string;
  icon: LucideIcon;
};

const links: LinkItem[] = [
  {
    id: 0,
    title: "模型设置",
    icon: Brain,
  },
  {
    id: 1,
    title: "API Key",
    icon: Key,
  },
  {
    id: 2,
    title: "外观设置",
    icon: AppWindow,
  },
  {
    id: 3,
    title: "帮助关于",
    icon: CircleHelp,
  },
];

const settingsNavConfig = atom({
  links,
  selected: 0,
});

export function useSettingsNavigator() {
  return useAtom(settingsNavConfig);
}