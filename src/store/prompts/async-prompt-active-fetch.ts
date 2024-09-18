import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getActivePrompt } from "@/api/settings";
import { Prompt } from "@/rust-bindings";
const KEY_PROMPT_ACTIVE = "active-prompt";

const _asyncPromptActiveFetch = createAsyncThunk(
  "prompts/async-prompts-active-fetch",
  async () => {
    const activeId = await getActivePrompt(KEY_PROMPT_ACTIVE);
    console.log("activeId", activeId)
    return Number(activeId);
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptActiveFetch.fulfilled, (state, action) => {
    console.log("_asyncPromptActive.fulfilled", { action });
    const activePrompt = state.prompts.find(
      (p: Prompt) => p.id == action.payload
    );
    if (activePrompt) {
      state.activatedPrompt = activePrompt;
    }
  });
};

export { _asyncPromptActiveFetch };

export default { _bindEffects };
