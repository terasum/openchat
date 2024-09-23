import { createSlice } from "@reduxjs/toolkit";

export type NavigatorTabTypes = "chat" | "prompt" | "settings" | "debug";

declare type LinkItem = {
  id: number;
  title: string;
  icon: string;
};

const links: LinkItem[] = [
  {
    id: 0,
    title: "模型设置",
    icon: "Brain",
  },

  {
    id: 1,
    title: "外观设置",
    icon: "AppWindow",
  },
  {
    id: 2,
    title: "帮助关于",
    icon: "CircleHelp",
  },
];

const settingsNavConfig = {
  links,
  selected: 0,
};

const settingsNav = createSlice({
  name: "settings-nav",
  initialState: settingsNavConfig,
  reducers: {
    setSettingsNav: (state, action) => {
      console.log("update config", { prev: state, next: action.payload });
      return action.payload;
    },
  },
  extraReducers(_builder) {},
});

export const { setSettingsNav } = settingsNav.actions;
// default reducer
export default settingsNav.reducer;
