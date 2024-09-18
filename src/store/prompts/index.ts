import { createSlice } from "@reduxjs/toolkit";
import { Prompt } from "@/rust-bindings";

import fetchAction from "./async-prompts-fetch";
import updateAction from "./async-prompt-update";
import deleteAction from "./async-prompt-delete";
import createAction from "./async-prompt-create";
import activeFetchAction from "./async-prompt-active-fetch";
import activeSetAction from "./async-prompt-active-set";

export type PromptStateProps = {
  prompts: Prompt[];
  selectedPrompt: Prompt;
  activatedPrompt: Prompt;
  updatePrompt: (prompt: Prompt) => void;
  setSelected: (id: number) => void;
  setActivated: (activated: number) => void;
  promptCreation: { create: () => Promise<Prompt> };
  promptDeletation: { delete: (id: number) => Promise<void> };
};

const initialSlice = {
  prompts: [] as Prompt[],
  selectedPrompt: {} as Prompt,
  activatedPrompt: {} as Prompt,
};

const promptsSlice = createSlice({
  name: "prompts",
  initialState: initialSlice,
  reducers: {
    setSelectPrompt: (state, action) => {
      console.log("prompts.setSelectPrompt", { action });
      const selected = state.prompts.find((p) => p.id == action.payload);
      if (!selected) return;
      state.selectedPrompt =selected;
    },
  },
  extraReducers(builder) {
    fetchAction._bindEffects(builder);
    updateAction._bindEffects(builder);
    deleteAction._bindEffects(builder);
    createAction._bindEffects(builder);
    activeFetchAction._bindEffects(builder);
    activeSetAction._bindEffects(builder);
  },
});

// Action creators are generated for each case reducer function
export const { setSelectPrompt } = promptsSlice.actions;

// Async Actions
export { _asyncPromptsFetch as asyncPromptsFetch } from "./async-prompts-fetch";
export { _asyncPromptUpdate as asyncPromptUpdate } from "./async-prompt-update";
export { _asyncPromptDelete as asyncPromptDelete } from "./async-prompt-delete";
export { _asyncPromptCreate as asyncPromptCreate } from "./async-prompt-create";
export { _asyncPromptActiveFetch as asyncPromptActiveFetch } from "./async-prompt-active-fetch";
export { _asyncPromptActiveSet as asyncPromptActiveSet } from "./async-prompt-active-set";

// export const openDevToolAction = (): AppThunk => async (dispatch, getState) => {
//   console.log("======== dispatch open_devtools =======");
//   await invoke("open_devtools");
//   dispatch(devToolOpened("debug"));
//   return;
// };

// default reducer
export default promptsSlice.reducer;
