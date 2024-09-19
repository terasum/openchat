import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { deletePrompt } from "@/api/prompt";
import { Prompt } from "@/rust-bindings";

const _asyncPromptDelete = createAsyncThunk(
  "prompts/async-prompts-delete",
  async (promptId: number) => {
    const result = deletePrompt(promptId);
    return result;
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptDelete.fulfilled, (state, action) => {
    console.log("asyncPromptDelete.fulfilled", { action });
    state.prompts = state.prompts.filter(
      (item: Prompt) => item.id != action.payload.id
    );
    if (state.prompts.length > 0) {
      state.selectedPrompt = state.prompts[0];
    }
  });
};

export { _asyncPromptDelete };

export default { _bindEffects };
