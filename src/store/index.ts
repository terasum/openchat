import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navigatorReducer from "./navigator";
import promptsReducer from "./prompts";
import appCinfigReducer from "./app-config"

const store = configureStore({
  reducer: {
    navigator: navigatorReducer,
    prompts: promptsReducer,
    appConfig: appCinfigReducer,
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

export default store;
