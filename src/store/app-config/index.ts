import { invoke } from "@tauri-apps/api/tauri";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunk } from "@/store";
import { defaultSettings, SettingsModel } from "@/model";
import { getAppConfig, updateAppConfig } from "@/api/settings";

export type NavigatorTabTypes = "chat" | "prompt" | "settings" | "debug";

export const openDevTool = createAsyncThunk(
  "navigator/openDevTool",
  async () => {
    await invoke("open_devtools");
  }
);

const appConfigSlice = createSlice({
  name: "app-config",
  initialState: defaultSettings,
  reducers: {
    updateConfig: (state, action) => {
      console.log("update config", { prev: state, next: action.payload });
      return action.payload;
    },
  },
  extraReducers(_builder) {},
});

export const { updateConfig } = appConfigSlice.actions;

export const asyncInitConfig = (): AppThunk => async (dispatch, _getState) => {
  const config = await getAppConfig();
  console.log("initConfig", config);
  dispatch(updateConfig(JSON.parse(config.value)));
  return;
};

export const asyncUpdateConfig =
  (config: Partial<SettingsModel>): AppThunk =>
  async (dispatch, getState) => {
    const current = getState().appConfig;
    const newConfig = {
      ...current,
      ...config,
    };
    await updateAppConfig({
      key: "app-config",
      value: JSON.stringify(newConfig),
      id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    dispatch(updateConfig(newConfig));
  };

// default reducer
export default appConfigSlice.reducer;
