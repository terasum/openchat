import {
  encode,
  encodeChat,
  decode,
  isWithinTokenLimit,
  encodeGenerator,
  decodeGenerator,
  decodeAsyncGenerator,
} from "gpt-tokenizer";

import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";

// note: depending on the model, import from the respective file, e.g.:
// import {...} from 'gpt-tokenizer/model/gpt-4o'
import { SessionData } from "@/model/session-data-model";

import { makeRequest } from "@/lib/request";

// const text = "Hello, world!";
// const tokenLimit = 10;

// // Encode text into tokens
// const tokens = encode(text);

// // Decode tokens back into text
// const decodedText = decode(tokens);

// // Check if text is within the token limit
// // returns false if the limit is exceeded, otherwise returns the actual number of tokens (truthy value)
// const withinTokenLimit = isWithinTokenLimit(text, tokenLimit);

// // Example chat:
// const chat = [
//   { role: "system", content: "You are a helpful assistant." },
//   { role: "assistant", content: "gpt-tokenizer is awesome." },
// ] as const;

// // Encode chat into tokens
// const chatTokens = encodeChat(chat);

// // Check if chat is within the token limit
// const chatWithinTokenLimit = isWithinTokenLimit(chat, tokenLimit);

// // Encode text using generator
// for (const tokenChunk of encodeGenerator(text)) {
//   console.log(tokenChunk);
// }

// // Decode tokens using generator
// for (const textChunk of decodeGenerator(tokens)) {
//   console.log(textChunk);
// }

// // Decode tokens using async generator
// // (assuming `asyncTokens` is an AsyncIterableIterator<number>)
// // for await (const textChunk of decodeAsyncGenerator(asyncTokens)) {
// //   console.log(textChunk);
// // }

// /**
//  *  估算字符串所需的token数量
//  * @param str 需要估算的字符串
//  */
// //TODO
// export function estimateTokens(str: string): number {
//   return 0;
//   //   const { tokenUnit } = useSettingsStore()

//   //   const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(str)
//   //   const length = encoded.bpe.length

//   //   return tokenUnit === 'TK' ? length : Number((length * 0.0002).toFixed(3))
// }

export interface OpenAIReqOpts {
  api_key: string;
  api_model: string;
  api_temprature: number;
  api_max_tokens: number;

  api_base: string;
  api_path: string;
}

import { Stream } from "@/lib/streaming";

export async function chatCompletionStream(
  messages: SessionData[],
  opts: OpenAIReqOpts
) {
  if (!messages.length) throw new Error("messages is empty");
  if (!opts.api_key) throw new Error("api_key is empty");
  if (!opts.api_base) throw new Error("api_base is empty");
  if (!opts.api_path) throw new Error("api_path is empty");
  if (!opts.api_temprature) throw new Error("api_temprature is empty");
  if (!opts.api_max_tokens) throw new Error("api_max_tokens is empty");

  Stream.fromSSEResponse(new Response(), new AbortController());
}

/**
 * 获取 openai 对话消息(流)
 * @param messages 消息列表
 */
export async function requestOpenAIStream(
  messages: SessionData[],
  opts: OpenAIReqOpts
) {
  if (!messages.length) throw new Error("messages is empty");
  if (!opts.api_key) throw new Error("api_key is empty");
  if (!opts.api_base) throw new Error("api_base is empty");
  if (!opts.api_path) throw new Error("api_path is empty");
  if (!opts.api_temprature) throw new Error("api_temprature is empty");
  if (!opts.api_max_tokens) throw new Error("api_max_tokens is empty");

  // 创建一个新的 AbortController
  const abortController = new AbortController();

  await fetchEventSource(opts.api_base + opts.api_path, {
    method: "POST",
    body: JSON.stringify({
      model: opts.api_model || "gpt-4o-mini",
      messages,
      temperature: opts.api_temprature,
      max_tokens: opts.api_max_tokens,
      stream: true,
    }),

    headers: {
      Authorization: `Bearer ${opts.api_key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal: abortController.signal,
    async onopen(response) {
      if (response.ok) {
        console.log("[api/openai.ts] request_openai_stream open success");
        return;
      }

      if (response.status === 429) {
        throw new Error("errors.keyOverLimit");
      } else if (response.status === 401) {
        throw new Error("errors.disableApiKey");
      } else if (response.status === 402) {
        throw new Error("errors.ApiKeyExpired");
      } else {
        throw new Error("errors.requestError");
      }
    },
    onmessage(msg: EventSourceMessage) {
      console.log("[api/openai.ts] request_openai_stream onmessage", msg);
      if (msg.event === "error") {
        const { error_msg } = JSON.parse(msg.data);
        if (!error_msg) return;
        // TODO: return the result
        console.error(
          "[api/openai.ts] request_openai_stream failed, ",
          error_msg
        );
        return;
      }

      if (msg.event == "done" || msg.data === "[DONE]") {
        return;
      }

      if (msg.event == "data" || msg.data !== "[DONE]") {
        const { choices } = JSON.parse(msg.data);
        if (!choices) return;
        if (!choices.length) return;
        if (!choices[0].delta) return;
        if (!choices[0].delta.content) return;
        // TODO: return the result
        console.log(
          "[api/openai.ts] request_openai_stream success, ",
          choices[0].delta.content
        );
      }
    },
    onclose() {
      // TODO: fix this finished session
      console.log("[api/openai.ts] request_openai_stream finished");
      // updateSessionData(getLastItem(sessionDataList.value!))
    },
    onerror(e: any) {
      console.error("[api/openai.ts] request_openai_stream error", e);
      if (e.message) {
        console.error(e.message);
        throw new Error(e.message);
      }
      throw e;
    },
  });
}

export async function retrieveOpenAIStream(
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

// type APIResponseProps = {
//   response: Response;
//   options: FinalRequestOptions;
//   controller: AbortController;
// };

// async function defaultParseResponse<T>(props: APIResponseProps): Promise<T> {
//   const { response } = props;
//   if (props.options.stream) {
//     debug('response', response.status, response.url, response.headers, response.body);

//     // Note: there is an invariant here that isn't represented in the type system
//     // that if you set `stream: true` the response type must also be `Stream<T>`

//     if (props.options.__streamClass) {
//       return props.options.__streamClass.fromSSEResponse(response, props.controller) as any;
//     }

//     return Stream.fromSSEResponse(response, props.controller) as any;
//   }

//   // fetch refuses to read the body when the status code is 204.
//   if (response.status === 204) {
//     return null as T;
//   }

//   if (props.options.__binaryResponse) {
//     return response as unknown as T;
//   }

//   const contentType = response.headers.get('content-type');
//   const isJSON =
//     contentType?.includes('application/json') || contentType?.includes('application/vnd.api+json');
//   if (isJSON) {
//     const json = await response.json();

//     debug('response', response.status, response.url, response.headers, json);

//     return json as T;
//   }

//   const text = await response.text();
//   debug('response', response.status, response.url, response.headers, text);

//   // TODO handle blob, arraybuffer, other content types, etc.
//   return text as unknown as T;
// }
