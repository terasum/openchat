import { atom, useAtom } from "jotai";

import { fetchPrompt, updatePrompt } from "@/api/prompt";
import { Prompt } from "@/rust-bindings";
import { atomWithQuery } from "jotai-tanstack-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export interface PromptState {
  selected: number;
  actived: number;
}

const initialState = atom({
  selected: 0,
  actived: 0,
});

const initQueryState = atom({
  start: 0,
  offset: 100,
});

const promptsQueryAtom = atomWithQuery((get) => ({
  queryKey: ["prompts", get(initQueryState)],
  queryFn: async ({ queryKey: [, args] }) => {
    console.log("[use-prompts] ============ trigger query =============");
    const { start, offset } = args as { start: number; offset: number };
    const res = await fetchPrompt(start, offset);
    return res;
  },
  placeholderData: () => {
    return [
      {
        id: 0,
        title: "Default Prompt",
        desc: "Default Prompt",
        system: "You are a helpful assistant.",
        favorite: false,
        with_context: false,
        with_context_size: 0,
        max_tokens: 1024,
        top_p: "0.8",
        temperature: "0.8",
        opts: "",
        prehandle_script: "",
        labels: "",
        created_at: "",
        updated_at: "",
      },
    ] as Prompt[];
  },
}));

export const usePromptMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Prompt) => {
      console.log("[use-prompts] ============ trigger mutation =============");
      console.log("mutationFn", data);
      const newData = await updatePrompt(data);
      console.log("mutationFn.newData", newData);
      return newData;
    },
    mutationKey: ["prompts-update"],
    onSuccess: () => {
      console.log("mutationFn.onSuccess");

      void queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: (e: any) => {
      console.log("mutationFn.error", e);
    },
    onMutate: async (data: Prompt) => {
      console.log("[use-prompts] ============ trigger onMutate =============");
      return { data };
    },
  });
};

export function usePrompt() {
  const [state, setState] = useAtom(initialState);
  const [query] = useAtom(promptsQueryAtom);
  const mutate = usePromptMutation();

  const setSelected = (id: number) => {
    setState((prev) => ({ ...prev, selected: id }));
  };

  const setActivated = (id: number) => {
    setState((prev) => ({ ...prev, actived: id }));
  };

  return {
    query,
    mutation: mutate,
    selected: state.selected,
    actived: state.actived,
    setSelected,
    setActivated,
  };
}
