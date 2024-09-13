import { Separator, Textarea, Badge } from "@/components/ui";
import { useState, useEffect } from "react";

import { usePrompt } from "@/hooks/use-prompts";
import { cn, debounce } from "@/lib/utils";

import { PromptMeta } from "./PromptMeta";
import { PromptSettings } from "./PromptSettings";
import { PromptToolbar } from "./PromptToolbar";
export function PromptContent() {
  const { query, selected, mutation } = usePrompt();
  const { data } = query;
  const prompts = data;
  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;
  const labels = prompt?.labels ? prompt.labels.split(",") : [];

  const [state, setState] = useState({
    system: "",
  });

  useEffect(() => {
    setState({
      system: prompt!.system,
    });
  }, []);

  const updateDebounceFn = debounce((newText) => {
    mutation.mutate({
      ...prompt!,
      system: newText,
    });
  }, 400);

  return (
    <>
      <PromptMeta />
      <Separator />

      <div className="flex flex-col h-[calc(100%-100px)] overflow-y-auto">
        <div className="flex flex-row flex-1">
          <div
            className={cn(
              "whitespace-pre-wrap p-4 text-sm overflow-y-auto overflow-x-hidden w-[100%]"
            )}
          >
            <h3 className="text-md mb-1 text-gray-400">SYSTEM:</h3>
            <Textarea
              value={state.system}
              className="h-[360px]"
              onChange={(e) => {
                console.log(e.target.value);
                setState((draft) => {
                  updateDebounceFn(e.target.value);
                  return {
                    ...draft,
                    system: e.target.value,
                  };
                });
              }}
            />
            <div className="flex items-center gap-2 mt-3">
            {labels.length ? (
              <div className="flex items-center gap-2">
                {prompt?.actived ? (
                  <Badge variant={"default"}>{"active"}</Badge>
                ) : (
                  <Badge variant={"outline"}>{"unused"}</Badge>
                )}

                {labels.map((label) => (
                  <Badge key={label} variant={"outline"}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          </div>
          
          <Separator orientation="vertical" />

          <PromptSettings />
        </div>
      </div>
      <Separator />

      <PromptToolbar />
    </>
  );
}
