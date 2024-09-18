import { Separator, Textarea } from "@/components/ui";

import { cn } from "@/lib/utils";

import { PromptMeta } from "./PromptMeta";
import { PromptSettings } from "./PromptSettings";
import { PromptToolbar } from "./PromptToolbar";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import { Prompt } from "@/rust-bindings";
import { asyncPromptUpdate } from "@/store/prompts";
export function PromptContent() {
  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );

  const dispatch = useAppDispatch();

  function updatePrompt(prompt: Prompt) {
    dispatch(asyncPromptUpdate(prompt));
  }

  return (
    <>
      <PromptToolbar />
      <Separator />
      <PromptMeta />
      <div className="flex flex-col h-[calc(100%-160px)] overflow-y-auto">
        <div className="flex flex-row flex-1">
          <div
            className={cn(
              "whitespace-pre-wrap p-4  min-h-[280px] w-[100%] min-w-[360px] max-w-[1280px]"
            )}
          >
            <h1 className="text-slate-500">System Prompt:</h1>
            <Textarea
              value={selectedPrompt.system || ""}
              className="w-[100%] h-[calc(100%-20px)] text-sm overflow-y-auto"
              onChange={(e) => {
                updatePrompt({
                  ...selectedPrompt,
                  system: e.target.value,
                });
              }}
            />
          </div>

          <PromptSettings />
        </div>
      </div>
    </>
  );
}
