import { Label, Switch, Slider } from "@/components/ui";

import { usePrompt } from "@/hooks/use-prompts";
import { useEffect, useState } from "react";

import { debounce } from "@/lib/utils";

export function PromptSettings() {
  const { query, selected, mutation } = usePrompt();
  const { data } = query;
  const prompts = data;
  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;

  const [state, setState] = useState({
    max_tokens: 1200,
    temperature: 0.8,
    top_p: 0.8,
    with_context: true,
    with_context_size: 8,
  });

  const updateDebounceFn = debounce((newState) => {
    mutation.mutate({
      ...prompt!,
      ...newState,
      temperature: String(newState.temperature),
      top_p: String(newState.top_p),
    });
  }, 400);

  useEffect(() => {
    setState({
      max_tokens: Number(prompt?.max_tokens),
      temperature: Number(prompt?.temperature),
      top_p: Number(prompt?.top_p),
      with_context: !!prompt?.with_context,
      with_context_size: Number(prompt?.with_context_size),
    });
  }, []);

  return (
    <div className="flex flex-col items-start gap-2 p-2 w-[200px]">
      <div className="mb-4 w-full">
        <Label
          htmlFor="with_context"
          className="flex flex-row items-center text-xs font-normal text-gray-500 justify-between w-full"
        >
          上下文记忆
          <Switch
            id="with_context"
            checked={state.with_context}
            onCheckedChange={(e) => {
              setState((draft) => {
                draft.with_context = e;
                updateDebounceFn(draft);
                return draft;
              });
            }}
          />
        </Label>
      </div>
      <div className="mb-4 w-full gap-2 grid grid-rows-2">
        <Label
          htmlFor="with_context_size"
          className="flex text-xs font-normal text-gray-500 justify-between"
        >
          <span>携带上下文数量</span> <span>{state.with_context_size}</span>
        </Label>
        <Slider
          id="with_context_size"
          min={0}
          max={128}
          step={1}
          value={[state.with_context_size]}
          onValueChange={(e) => {
            console.log(e);
            setState((draft) => {
              draft.with_context_size = e[0];
              updateDebounceFn(draft);
              return draft;
            });
          }}
        />
      </div>
      <div className="mb-4 w-full gap-2 grid grid-rows-2">
        <Label
          htmlFor="with_context_size"
          className="flex text-xs font-normal text-gray-500 justify-between"
        >
          <span>最大Token数</span> <span>{state.max_tokens}</span>
        </Label>
        <Slider
          id="max_tokens"
          min={100}
          max={2500}
          step={10}
          value={[state.max_tokens]}
          onValueChange={(e) => {
            console.log(e);
            setState((draft) => {
              draft.max_tokens = e[0];
              updateDebounceFn(draft);
              return draft;
            });
          }}
        />
      </div>
      <div className="mb-4 w-full gap-2 grid grid-rows-2">
        <Label
          htmlFor="temperature"
          className="flex text-xs font-normal text-gray-500 justify-between"
        >
          <span>Temperature</span> <span>{state.temperature}</span>
        </Label>
        <Slider
          id="temperature"
          min={0.1}
          max={2}
          step={0.1}
          value={[state.temperature]}
          onValueChange={(e) => {
            console.log(e);
            setState((draft) => {
              draft.temperature = e[0];
              updateDebounceFn(draft);
              return draft;
            });
          }}
        />{" "}
      </div>

      <div className="mb-4 w-full gap-2 grid grid-rows-2">
        <Label
          htmlFor="top_p"
          className="flex text-xs font-normal text-gray-500 justify-between"
        >
          <span>Top P</span> <span>{state.top_p}</span>
        </Label>
        <Slider
          id="top_p"
          min={0.1}
          max={1}
          step={0.1}
          value={[state.top_p]}
          onValueChange={(e) => {
            console.log(e);
            setState((draft) => {
              draft.top_p = e[0];
              updateDebounceFn(draft);
              return draft;
            });
          }}
        />
      </div>
    </div>
  );
}
