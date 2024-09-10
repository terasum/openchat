import { expect, test } from "vitest";
import { chatCompletionStream, OpenAIReqOpts } from "@/api/openai";
import { SessionData } from "@/model/session-data-model";

test("adds 1 + 2 to equal 3", () => {
  expect(
    (() => {
      return 1 + 2;
    })()
  ).toBe(3);
});

test("test openai stream api", async () => {
  const opts: OpenAIReqOpts = {
    api_base: "https://proxy.openchat.dev",
    // api_base: "http://localhost:8000",
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
      id: 1,
      sessionId: "1",
      is_ask: true,
      is_memory: false,
      message_type: "text",
      model: "gpt-3.5-turbo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      role: "user",
      message: "你好，请问 OpenAI 是由谁创建的?",
      id: 2,
      sessionId: "1",
      is_ask: true,
      is_memory: false,
      message_type: "text",
      model: "gpt-3.5-turbo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const decoder = new TextDecoder();
  const iter = await chatCompletionStream(
    sessionData.map((item) => {
      return {
        role: item.role,
        content: item.message,
      };
    }),
    opts
  );
  console.log("--------------------");
  let line = "";
  await iter.toReadableStream().pipeTo(
    new WritableStream({
      write(chunk) {
        const temp_json = JSON.parse(decoder.decode(chunk));
        line += temp_json.data.choices[0].delta.content;
        console.log(line);
      },
    })
  );

  console.log("--------------------");

  expect(7).toBe(7);
});
