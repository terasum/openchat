import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchPrompt } from "@/api/prompt";
import { getActivePrompt } from "@/api/settings";
import { Prompt } from "@/rust-bindings";
const KEY_PROMPT_ACTIVE = "active-prompt";

const _asyncPromptsInit = createAsyncThunk(
  "prompts/async-prompts-init",
  async () => {
    const prompts = await fetchPrompt(0, 100);
    const activePromptId = await getActivePrompt(KEY_PROMPT_ACTIVE);
    return {
      prompts,
      activePromptId,
    };
  }
);

const _bindEffects = (builder: ActionReducerMapBuilder<any>) => {
  builder.addCase(_asyncPromptsInit.fulfilled, (state, action) => {
    console.log("_asyncPromptsInit.fulfilled", { action });
    const { prompts, activePromptId } = action.payload;
    state.prompts = prompts;
    state.activatedPrompt = prompts.find(
      (p: Prompt) => p.id == Number(activePromptId)
    );
  });
};

export { _asyncPromptsInit };

export default { _bindEffects };
