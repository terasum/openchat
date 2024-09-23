import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navigatorReducer from "./navigator";
import promptsReducer from "./prompts";
import appCinfigReducer from "./app-config";
import settingsNav from "./settings";
import sidebarReducer from "./siderbar";
import conversationReducer from "./conversation";

const store = configureStore({
  reducer: {
    navigator: navigatorReducer,
    prompts: promptsReducer,
    appConfig: appCinfigReducer,
    settingNav: settingsNav,
    sidebar: sidebarReducer,
    conversation: conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
