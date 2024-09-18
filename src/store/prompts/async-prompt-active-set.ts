import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { setActivePrompt } from "@/api/settings";
import { Prompt } from "@/rust-bindings";
const KEY_PROMPT_ACTIVE = "active-prompt";
const _asyncPromptActiveSet = createAsyncThunk(
  "prompts/async-prompts-active",
  async (id: number) => {
    await setActivePrompt(KEY_PROMPT_ACTIVE, String(id))
    return id;
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptActiveSet.fulfilled, (state, action) => {
    console.log("_asyncPromptActiveSet.fulfilled", { action });
    state.activatedPrompt = state.prompts.find((p: Prompt) => p.id == action.payload) || state.activatedPrompt;

    state.prompts = state.prompts.map((p: Prompt) => {
      if (p.id == action.payload) {
        p.actived = true;
      } else {
        p.actived = false;
      }
      return p;
    });
  });
};

export { _asyncPromptActiveSet };

export default { _bindEffects };
