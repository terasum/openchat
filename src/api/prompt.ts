import {
  wrapGetPromptList,
  wrapUpdatePrompt,
  wrapNewPrompt,
  wrapDeletePrompt,
} from "@/rust-bindings";
import { Prompt } from "@/rust-bindings";

import { Logger } from "@/lib/log";
const logger = new Logger("prompt.ts");
/**
 * 获取指定页面的会话列表
 * @pure
 * @param start 开始数据条数
 * @param offset 结束数据条数
 * @returns prompts list = Prompt[]
 */
export async function fetchPrompt(
  start: number = 0,
  offset: number = 100
): Promise<Prompt[]> {
  logger.log("fetchPrompt", "args", { start, offset });
  // 请求 invoke rust 接口
  const res = await wrapGetPromptList(start, offset);
  if (!res || !(res instanceof Array)) {
    logger.error("fetchPrompt", "error,prompt is not an array", { res });
    return [];
  }

  const promptList = res as Prompt[];
  logger.log("fetchPrompt", "prompt list result: ", { promptList });
  return promptList.sort(
    (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

export async function updatePrompt(prompt: Prompt) {
  logger.log("updatePrompt", "update args: ", { prompt });
  const updatePrompt = await wrapUpdatePrompt(prompt);
  return updatePrompt;
}

export async function newPrompt() {
  try {
    const newPrompt = await wrapNewPrompt();
    return newPrompt;
  } catch (e: any) {
    logger.error("newPrompt", "error", { error: e });
    throw e;
  }
}

export async function deletePrompt(id: number) {
  try {
    const deleted = await wrapDeletePrompt(id);
    return deleted;
  } catch (e: any) {
    logger.error("deletePrompt", "error", { error: e });
    throw e;
  }
}
