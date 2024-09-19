import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { newPrompt } from "@/api/prompt";

const _asyncPromptCreate = createAsyncThunk(
  "prompts/async-prompts-new",
  async () => {
    const result = newPrompt();
    return result;
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptCreate.fulfilled, (state, action) => {
    console.log("asyncPromptCreate.fulfilled", { action });
    state.prompts = [action.payload, ...state.prompts];
    if (state.prompts.length > 0) {
      state.selectedPrompt = state.prompts[0];
    }
  });
};

export { _asyncPromptCreate };

export default { _bindEffects };
