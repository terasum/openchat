import { makeRequest } from "@/lib/request";
import { Stream } from "@/lib/streaming";
const decoder = new TextDecoder();

export interface OpenAIReqOpts {
  url: string;
  api_key: string;
  model: string;
  temprature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
}

export async function chatCompletionStream(
  messages: { role: string; content: string }[],
  opts: OpenAIReqOpts
) {
  const { response, controller } = await makeRequest({
    method: "post",
    url: opts.url,
    body: {
      model: opts.model || "gpt-4o-mini",
      messages,
      temperature: opts.temprature,
      max_tokens: opts.max_tokens,
      stream: true,
    },
    headers: {
      Authorization: `Bearer ${opts.api_key}`,
    },
    timeout: 600000,
  });
  return Stream.fromSSEResponse(response, controller);
}

/**
 * 流式请求 openai chat complemention 接口
 * @param contexts 对话上下文
 * @param onUpdate 流式更新回调
 * @param onDone 完成回调
 * @param onError 错误回调
 * @param opts 请求参数
 * @param abortSignal abort信号量
 * @returns void
 */
export async function chatWithOpenAI(
  contexts: { role: string; content: string }[],
  onUpdate: (chunk: string) => void,
  onDone: (response: string) => void,
  onError: (error: Error) => void,
  opts?: OpenAIReqOpts,
  abortSignal?: AbortSignal
) {
  const defaultOpts = {
    url: "https://proxy.openchat.dev/v1/chat/completions",
    api_key: "SK-<your-api-key>",
    model: "gpt-4o-mini",
    temprature: 0.8,
    max_tokens: 2000,
    top_p: 1,
    stream: true,
  };
  opts = opts ?? defaultOpts;
  abortSignal = abortSignal ?? new AbortController().signal;
  if (contexts.length <= 0) {
    onError(new Error("contexts is empty"));
    return;
  }

  console.log("--------- OPENAI START -----------");
  console.log("current_opts", { opts });
  console.log(`current_context: ${JSON.stringify(contexts)}`);
  const iter = await chatCompletionStream(contexts, opts);
  let line = "";
  await iter.toReadableStream().pipeTo(
    new WritableStream({
      write(chunk) {
        try {
          const temp_json = JSON.parse(decoder.decode(chunk));
          const choices = temp_json.data?.choices ?? temp_json.choices;
          
          const temp_tokens = choices[0].delta.content;
          if (temp_tokens && !abortSignal.aborted) {
            onUpdate(temp_tokens);
            line += temp_tokens;
          }
        } catch (e: any) {
          console.error("writable stream write error,", e);
          onError(e);
        }
      },
    })
  );
  onDone(line);
  console.log("---------- OPENAI END ----------");
}
