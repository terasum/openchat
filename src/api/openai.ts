import { SessionData } from "@/model/session-data-model";
import { makeRequest } from "@/lib/request";
import { Stream } from "@/lib/streaming";

export interface OpenAIReqOpts {
  api_key: string;
  api_model: string;
  api_temprature: number;
  api_max_tokens: number;
  api_base: string;
  api_path: string;
}

/**
 * 
 * @param session_data session data
 * @param opts request data
 * @returns 
 * 
 * example:
 * ```ts
 * const opts: OpenAIReqOpts = {
    api_base: "https://proxy.openchat.dev",
    api_path: "/v1/chat/completions",
    api_key: "SK-sc26ff22b40dbb408cbd43c00900e83650",
    api_model: "gpt-4o-mini",
    api_temprature: 0.8,
    api_max_tokens: 2000,
  };

  const sessionData: SessionData[] = [
    {
      role: "system",
      message:
        "你是一名通用人工智能助手，你将用尽量专业的知识回答用户的问题，所有问题简洁易懂，字数不超过100字，以纯文本格式输出，不要以 Markdown 格式输出。",
      createdAt: new Date(),
      id: 1,
      sessionId: 1,
    },
    {
      role: "user",
      message: "你好，请问 OpenAI 是由谁创建的?",
      createdAt: new Date(),
      id: 2,
      sessionId: 1,
    },
  ];

  const decoder = new TextDecoder();
  const iter = await chatCompletionStream(sessionData, opts);
  let line = "";
  await iter.toReadableStream().pipeTo(new WritableStream({
    write(chunk) {
      const temp_json = JSON.parse(decoder.decode(chunk));
      line+=temp_json.data.choices[0].delta.content
      console.log(line)
    },
  }));
 */
export async function chatCompletionStream(
  session_data: SessionData[],
  opts: OpenAIReqOpts
) {
  const messages = session_data.map(({ role, message }) => ({
    role,
    content: message,
  }));
  const { response, controller } = await makeRequest({
    method: "post",
    url: opts.api_base + opts.api_path,
    body: {
      model: opts.api_model || "gpt-4o-mini",
      messages,
      temperature: opts.api_temprature,
      max_tokens: opts.api_max_tokens,
      stream: true,
    },
    headers: {
      Authorization: `Bearer ${opts.api_key}`,
    },
    timeout: 600000,
  });
  return Stream.fromSSEResponse(response, controller);
}
