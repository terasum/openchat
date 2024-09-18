import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchPrompt } from "@/api/prompt";

const _asyncPromptsFetch = createAsyncThunk(
  "prompts/async-prompts-fetch",
  async () => {
    const result = await fetchPrompt(0, 100);
    return result;
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptsFetch.fulfilled, (state, action) => {
    console.log("asyncPromptsFetch.fulfilled", { action });
    state.prompts = action.payload;
    if (action.payload && action.payload.length > 0){
        state.selectedPrompt = action.payload[0];
    }
  });
};

export { _asyncPromptsFetch };

export default { _bindEffects };
