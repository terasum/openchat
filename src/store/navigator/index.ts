
import { invoke } from "@tauri-apps/api/tauri";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunk, type RootState } from "@/store";
import { build } from "vite";


export type NavigatorTabTypes = "chat" | "prompt" | "settings" | "debug";

const functionTabsInit = [
  {
    id: "chat",
    label: "Chat",
  },
  {
    id: "prompt",
    label: "Prompt",
  },
];

const settingsTabsInit = [
  {
    id: "debug",
    label: "Debug",
  },
  {
    id: "settings",
    label: "Settings",
  },
];

const initialSlice = {
  functionTabs: functionTabsInit,
  settingsTabs: settingsTabsInit,
  currentTab: "chat" as NavigatorTabTypes,
};

export const openDevTool = createAsyncThunk("navigator/openDevTool", async () => {
  await invoke("open_devtools");
});

const navigatorSlice = createSlice({
  name: "navigator",
  initialState: initialSlice,
  reducers: {
    selectTab: (state, action) => {
      console.log("navigator.selectTab", { action });
      if (action.payload === "debug"){
        return;
      }
      state.currentTab = action.payload;
    },
    devToolOpened: (state, action) => {
      console.log("navigator.devToolOpened", { action });
    },
  },
  extraReducers(builder) {
    // 异步动作需要定义处理
    builder.addCase(openDevTool.fulfilled, (state, action) => {
      console.log("openDevTool.fulfilled", { action });
      return;
    });
    builder.addCase(openDevTool.rejected, (state, action) => {
      console.log("openDevTool.rejected", { action });
      return;
    });
    builder.addCase(openDevTool.pending, (state, action) => {
      console.log("openDevTool.pending", { action });
      return;
    });
    builder.addDefaultCase((state, action) => {
      console.log("navigator.defaultCase", { action });
    });
  },
});

// Action creators are generated for each case reducer function
export const { selectTab, devToolOpened } = navigatorSlice.actions;
export const openDevToolAction = (): AppThunk => async (dispatch, getState) => {
  console.log("======== dispatch open_devtools =======")
  await invoke("open_devtools");
  dispatch(devToolOpened("debug"));
  return;
};
// state selectors
export const functionTabs = (state: RootState) => state.navigator.functionTabs;
export const settingsTabs = (state: RootState) => state.navigator.settingsTabs;
export const currentTab = (state: RootState) => state.navigator.currentTab;
// default reducer
export default navigatorSlice.reducer;
