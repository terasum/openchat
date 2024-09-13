import { wrapGetPromptList, wrapUpdatePrompt } from "@/rust-bindings";
import { Prompt } from "@/rust-bindings";

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
    console.log("[api] fetchPrompts", start, offset);
  // 请求 invoke rust 接口
  const res = await wrapGetPromptList(start, offset);
  if (!res || !(res instanceof Array)) {
    console.error("(fetchPrompt): prompt is not an array");
    return [];
  }

  const promptList = res as Prompt[];
  console.log("========= result =======")
  console.log(promptList)
  return promptList.sort(
    (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}


export async function updatePrompt(prompt: Prompt){
  const updatePrompt = await wrapUpdatePrompt(prompt);
  return updatePrompt;
}