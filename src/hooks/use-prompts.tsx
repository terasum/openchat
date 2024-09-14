import { atom, useAtom } from "jotai";
import { useState } from "react";

import {
  fetchPrompt,
  updatePrompt,
  newPrompt,
  deletePrompt,
} from "@/api/prompt";

import { Prompt } from "@/rust-bindings";
import { atomWithQuery } from "jotai-tanstack-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { setActivePrompt, getActivePrompt } from "@/api/settings";

import { Logger } from "@/lib/log";
import { useEffect } from "react";
import { debounce } from "@/lib/utils";

export interface PromptState {
  selected: number;
}

export type PromptStateProps = {
  prompts: Prompt[];
  selectedPrompt: Prompt;
  activatedPrompt: Prompt;
  updatePrompt: (prompt: Prompt) => void;
  setSelected: (id: number) => void;
  setActivated: (activated: number) => void;
  promptCreation: { create: () => Promise<Prompt> };
  promptDeletation: { delete: (id: number) => Promise<void> };
};

const logger = new Logger("use-prompts.tsx");

const KEY_PROMPTS = "prompts";
const KEY_PROMPTS_UPDATE = "prompts-update";

const KEY_PROMPT_ACTIVE = "active-prompt";
const KEY_PROMPT_ACTIVE_UPDATE = "active-prompt-update";

const initQueryState = atom({
  start: 0,
  offset: 100,
});

const activeSettingQueryAtom = atomWithQuery((_get) => ({
  queryKey: [KEY_PROMPT_ACTIVE],
  queryFn: async () => {
    const activeStr = await getActivePrompt(KEY_PROMPT_ACTIVE);
    logger.log("activeSettingQueryAtom", { activeStr });
    return Number(activeStr);
  },
  placeholderData: () => {
    return 1;
  },
}));

export const useActiveSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activeId: number) => {
      logger.log("useActiveSettingMutation", "mutationFn trigger", {
        activeId,
      });
      await setActivePrompt(KEY_PROMPT_ACTIVE, String(activeId));
    },
    mutationKey: [KEY_PROMPT_ACTIVE_UPDATE],
    onSuccess: () => {
      logger.log("useActiveSettingMutation", "mutationFn trigger onSuccess");
      void queryClient.invalidateQueries({ queryKey: [KEY_PROMPT_ACTIVE] });
    },
    onError: (e: any) => {
      logger.error("useActiveSettingMutation", "mutationFn trigger error", {
        error: e,
      });
    },
  });
};

const promptsQueryAtom = atomWithQuery((get) => ({
  queryKey: [KEY_PROMPTS, get(initQueryState)],
  queryFn: async ({ queryKey: [, args] }) => {
    logger.log("promptsQueryAtom", "queryFn trigger", { args });
    const { start, offset } = args as { start: number; offset: number };
    const res = await fetchPrompt(start, offset);
    logger.log("promptsQueryAtom", "queryFn trigger result", { res });
    return res;
  },
}));

export const usePromptMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Prompt) => {
      logger.log("usePromptMutation", "mutationFn trigger", { data });
      const newData = await updatePrompt(data);
      logger.log("usePromptMutation", "mutationFn trigger result", { newData });
      return newData;
    },
    mutationKey: [KEY_PROMPTS_UPDATE],
    onSuccess: () => {
      logger.log("usePromptMutation", "mutationFn trigger onSuccess");
      void queryClient.invalidateQueries({ queryKey: [KEY_PROMPTS] });
    },
    onError: (e: any) => {
      logger.error("usePromptMutation", "mutationFn trigger error", {
        error: e,
      });
    },
  });
};

export const usePromptCreation = () => {
  const queryClient = useQueryClient();
  return {
    create: async () => {
      logger.log("usePromptCreation", "create trigger");
      const newData = await newPrompt();
      logger.log("usePromptCreation", "create trigger result ", { newData });
      void queryClient.invalidateQueries({ queryKey: [KEY_PROMPTS] });
      return newData;
    },
  };
};

export const usePromptDeletation = () => {
  const queryClient = useQueryClient();
  return {
    delete: async (id: number) => {
      logger.log("usePromptDeletation", "delete trigger");
      await deletePrompt(id);
      logger.log("usePromptDeletation", "delete trigger success");
      void queryClient.invalidateQueries({ queryKey: [KEY_PROMPTS] });
    },
  };
};

export function usePrompt(): PromptStateProps {
  const promptMutateAction = usePromptMutation();
  const promptCreateAction = usePromptCreation();
  const promptDeleteAction = usePromptDeletation();
  const [promptQuery] = useAtom(promptsQueryAtom);

  const [activeQuery] = useAtom(activeSettingQueryAtom);

  const activeMutationAction = useActiveSettingMutation();

  const [promptList, setPromptList] = useState([] as Prompt[]);
  const [selectedPrompt, setSelectPrompt] = useState({
    id: -1,
    title: "",
    desc: "",
    system: "",
  } as Prompt);
  const [activatedPrompt, setActivatedPrompt] = useState({
    id: -1,
    system: "",
  } as Prompt);

  useEffect(() => {
    // 如果数据有变化，则重新设置选中的prompt
    if (promptQuery.isPending || !promptQuery.data) return;
    setPromptList(
      promptQuery.data.sort((a, b) => {
        return b.id - a.id;
      })
    );
    if (selectedPrompt.id == -1) {
      setSelectPrompt(promptQuery.data[0]);
    }
  }, [promptQuery.isLoading]);

  useEffect(() => {
    logger.log("useEffect[activeQuery]", "trigger", { data: activeQuery.data });
    // 如果数据有变化，则重新设置选中的prompt
    if (activeQuery.isPending) return;
    const draft = promptList.find((item) => item.id == activeQuery.data);
    if (draft) {
      setActivatedPrompt(draft);
    }
  }, [activeQuery.isLoading, promptList]);

  useEffect(() => {
    logger.log("useEffect[state.prompt]", "trigger", {
      selectedPrompt,
    });
    promptMutateFn(selectedPrompt);
  }, [selectedPrompt]);

  const promptMutateFn = debounce((prompt: Prompt) => {
    logger.log("promptMutateFn", "trigger", { prompt });
    if (prompt.id==-1 || prompt.favorite == undefined){
      return;
    }
    const updatePrompt = promptMutateAction.mutate(prompt);
    logger.log("promptMutateFn", "trigger done", { updatePrompt });
  }, 300);

  const activeMutateFn = debounce((activated: number) => {
        logger.log("promptMutateFn", "trigger", { prompt });
    activeMutationAction.mutate(activated);
  }, 300);

  return {
    prompts: promptList,
    selectedPrompt,
    updatePrompt: (prompt: Prompt) => {
      setPromptList(
        promptList
          .map((item) => {
            if (item.id == prompt.id) {
              setSelectPrompt(prompt);
              return prompt;
            }
            return item;
          })
          .sort((a, b) => {
            return b.id - a.id;
          })
      );
    },
    promptCreation: promptCreateAction,
    promptDeletation: promptDeleteAction,

    setSelected: (selected: number) => {
      const draft = promptList.find((item) => item.id == selected) as Prompt;
      if (draft) {
        setSelectPrompt(draft);
      }
    },
    activatedPrompt,
    setActivated: (activated: number) => {
      const draft = promptList.find((item) => item.id == activated) as Prompt;
      if (draft) {
        setActivatedPrompt(draft);
        activeMutateFn(activated);
      }
    },
  };
}
