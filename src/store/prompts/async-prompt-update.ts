import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { updatePrompt } from "@/api/prompt";
import { Prompt } from "@/rust-bindings";

const _asyncPromptUpdate = createAsyncThunk(
  "prompts/async-prompts-update",
  async (prompt: Prompt) => {
    const result = updatePrompt(prompt);
    return result;
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptUpdate.fulfilled, (state, action) => {
    console.log("asyncPromptUpdate.fulfilled", { action });
    state.prompts = state.prompts.map((p: Prompt) => {
      if (p.id == action.payload.id) {
        state.selectedPrompt = action.payload;
        return action.payload;
      }
      return p;
    });
  });
};

export { _asyncPromptUpdate };

export default { _bindEffects };
