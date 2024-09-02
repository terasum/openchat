import { useState, useEffect } from "react";
import { MarkdownDemoData } from "@/lib/data/markdown-demo";
import { chatCompletionStream, OpenAIReqOpts } from "@/api/openai";

const decoder = new TextDecoder();

import {
  wrapGetSessionList,
  Session,
  wrapGetSessionDataById,
  SessionData,
} from "@/rust-bindings";

export interface Conversation {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
}


export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};

export function useConversation() {
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  function getConvMessage(): { role: string; content: string }[] {
    const selected = conversations.filter((conversation) => {
      return conversation.id == selectedConversation;
    });

    if (selected.length <= 0) {
      return [{ role: "assistant", content: "有什么可以帮您的吗?" }];
    }

    const messages = selected[0].messages.map((message) => {
      return message;
    });

    return messages.length > 0
      ? messages
      : [{ role: "assistant", content: "有什么可以帮您的吗?" }];
  }

  const handleSelectConversation = async (id: string) => {
    console.log(
      "[debug/App.tsx](handleSelectConversation): selectedConversation: ",
      selectedConversation
    );
    setSelectedConversation(id);
    const session_data = await wrapGetSessionDataById(id);
    console.log(
      "[debug/App.tsx](handleSelectConversation): session_data: ",
      session_data
    );
    if (session_data && session_data instanceof Array) {
      console.log(
        "[debug/App.tsx](handleSelectConversation): session_data(instance of Array): ",
        session_data
      );

      const session_data_list = session_data as unknown as SessionData[];
      const messages = session_data_list.map((session_data) =>
        JSON.parse(session_data.message)
      );

      setConversations((prevConversations) => {
        console.log("prevConversations: ", prevConversations);
        return prevConversations.map((conversation) =>
          conversation.id === id && messages.length > 0
            ? { ...conversation, messages: messages }
            : conversation
        );
      });
      console.log(`after setConversations`, conversations);
    }
  };

  useEffect(() => {
    wrapGetSessionList(0, 10).then((res) => {
      console.log("============ wrapGetSessionList ======== ");
      if (res && res instanceof Array) {
        const sessionList = res as unknown as Session[];
        const conversationList = sessionList.map((session) => {
          console.log("session: ", session);
          console.log("session id", session.id);
          return {
            id: session.id,
            title: session.title,
            messages: [] as { role: string; content: string }[],
          };
        });
        conversationList.push({
          id: "Markdown-Format",
          title: "Mardown-Format",
          messages: [
            { role: "assistant", content: "请问有什么可以帮您的吗？?" },
            { role: "user", content: "请问如何处理MDX文档?" },
            { role: "assistant", content: MarkdownDemoData() },
          ],
        });
        setConversations(conversationList);
        handleSelectConversation(conversationList[0].id);
      } else {
        console.error(res as unknown as string);
      }
    });
  }, []);

  function updateCurrentConversation(role: string, message: string) {
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        // 是当前对话
        if (conversation.id === selectedConversation) {
          if (conversation.messages.length > 0) {
            const latest_message =
              conversation.messages[conversation.messages.length - 1];

            // 如果最后一条，和需要更新的这一条一样 role 说明需要更新当前消息
            if (role === latest_message.role) {
              return {
                ...conversation,
                messages: [
                  ...conversation.messages.slice(0, -1),
                  { role: role, content: message },
                ],
              };
            }
          }
          // 当前消息列表为空，或者最后一条消息不是当前角色
          return {
            ...conversation,
            messages: [
              ...conversation.messages,
              { role: role, content: message },
            ],
          };
        }
        return conversation;
      });
    });
  }

  // ----------------- openAI part -------------------

  // 是否增在输出
  const [isResponsing, setIsResponsing] = useState(false);
  // 是否忽略
  const [isIgnoreResponse, setIsIgnoreResponse] = useState(false);

  async function handleOpenAIRequst(user_message: {
    role: string;
    content: string;
  }) {
    const opts: OpenAIReqOpts = {
      api_base: "https://proxy.openchat.dev",
      api_path: "/v1/chat/completions",
      api_key: "SK-sc26ff22b40dbb408cbd43c00900e83650",
      api_model: "gpt-4o-mini",
      api_temprature: 0.8,
      api_max_tokens: 2000,
    };

    const contexts = conversations
      .filter((conversation) => {
        return conversation.id === selectedConversation;
      })
      .map((conversation) => {
        return conversation.messages.map((message) => {
          return message;
        });
      });
    if (contexts.length <= 0) {
      return;
    }
    // TODO fix types
    const current_context = contexts[0];
    current_context.push(user_message);

    // const sessionData: SessionDataModel[] = [
    //   {
    //     role: "system",
    //     message:
    //       "你是一名通用人工智能助手，你将用尽量专业的知识回答用户的问题，所有问题简洁易懂，字数不超过100字，以纯文本格式输出，不要以 Markdown 格式输出。",
    //     createdAt: new Date(),
    //     id: 1,
    //     sessionId: 1,
    //   },
    //   {
    //     role: "user",
    //     message: "你好，请问 OpenAI 是由谁创建的?",
    //     createdAt: new Date(),
    //     id: 2,
    //     sessionId: 1,
    //   },
    // ];
    console.log("--------- OPENAI START -----------");
    console.log(`current_context: ${JSON.stringify(current_context)}`);

    const iter = await chatCompletionStream(current_context, opts);

    let line = "";
    await iter.toReadableStream().pipeTo(
      new WritableStream({
        write(chunk) {
          const temp_json = JSON.parse(decoder.decode(chunk));
          const temp_tokens = temp_json.data.choices[0].delta.content;
          if (temp_tokens) {
            line += temp_tokens;
            updateCurrentConversation("assistant", line);
          }
        },
      })
    );
    console.log("---------- OPENAI END ----------");
    return line;

  }

  function handleSendMessage(message: string) {
    console.log(`use-openai.tsx handle the message: ${message}`);
    // 忽略输出
    setIsIgnoreResponse(false);
    // 正在输出状态
    setIsResponsing(true);
    // 插入消息
    updateCurrentConversation("user", message);
    // 请求AI
    handleOpenAIRequst({
      role: "user",
      content: message,
    }).then((assistant_message) => {
      setIsResponsing(false);
      // TODO save the session data
      const user_record = {role: "user", content: message}
      const assistant_record = {role: "assistant", content: assistant_message}
      console.log("tobe saved: ", user_record);
      console.log("tobe saved", assistant_record)
      // wrapSaveSessionData(selectedConversation, assistant_record).then((res) => {
      //   console.log(`save session data: ${res}`);
      // });

      // wrapSaveSessionData(selectedConversation, user_record).then((res) => {
      //   console.log(`save session data: ${res}`);
      // });
      console.log(`use-openai.tsx handle the message done: ${message}`);
    });
  }

  // 立即停止
  function stopResponsing() {
    setIsIgnoreResponse(true);
    setIsResponsing(false);
  }

  return {
    conversations,
    setConversations,
    setSelectedConversation,
    selectedConversation,
    handleSelectConversation,
    getConvMessage,
    handleSendMessage,
    stopResponsing,
    isResponsing,
  };
}