import { atom, useAtom } from "jotai";

import { Prompt, prompts } from "@/hooks/prompts-data";

type Config = {
  selected: Prompt["id"] | null;
  actived: Prompt["id"]  | null;
};

const configAtom = atom<Config>({
  selected: prompts[0].id,
  actived: prompts[0].id,
});

export function usePrompt() {
  return useAtom(configAtom);
}
