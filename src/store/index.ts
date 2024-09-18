import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navigatorReducer from "./navigator";
import promptsReducer from "./prompts";

const store = configureStore({
  reducer: {
    navigator: navigatorReducer,
    prompts: promptsReducer,
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
