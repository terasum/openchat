import { useState, useEffect } from "react";
import { MarkdownDemoData } from "@/lib/data/markdown-demo";
import { chatCompletionStream, OpenAIReqOpts } from "@/api/openai";

const decoder = new TextDecoder();

import {
  wrapGetSessionList,
  wrapGetSessionDataById,
  wrapSaveSessionData,
  wrapNewSession,
  wrapDeleteSession,
  wrapUpdateSession,
  Session,
  SessionData,
} from "@/rust-bindings";

export interface Conversation extends Session {
  messages: { role: string; content: string }[];
}

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
    if (!session_data || session_data instanceof Array) {
      return;
    }

      console.log(
        "[debug/App.tsx](handleSelectConversation): session_data(instance of Array): ",
        session_data
      );

      const session_data_list = session_data as unknown as SessionData[];
      const messages = session_data_list.map((session_data) => {
        return { role: session_data.role, content: session_data.message };
      });

      setConversations((prevConversations) => {
        console.log("prevConversations: ", prevConversations);
        return prevConversations.map((conversation) =>
          conversation.id === id && messages.length > 0
            ? { ...conversation, messages }
            : conversation
        );
      });
      console.log(`after setConversations`, conversations);
  };

  const handleCreateConversation = async () => {
    let promptId = 1;
    await newConversation(promptId);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      deleteConversation(id);
    } catch (e) {
      console.error("delete convsation error", e);
    }
  };

  useEffect(() => {
    wrapGetSessionList(0, 10).then((res) => {
      console.log("============ wrapGetSessionList ======== ");
      if (res && res instanceof Array) {
        const sessionList = res as unknown as Session[];
        const conversationList = sessionList
          .map((session) => {
            console.log("db data session: ", session);
            return {
              ...session,
              messages: [] as { role: string; content: string }[],
            };
          })
          .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));

        conversationList.push({
          id: "markdown-format",
          title: "Markdown formatter",
          prompt_id: 1,
          with_context: false,
          with_context_size: 0,
          session_model: "gpt-4o-mini",
          messages: [
            { role: "assistant", content: "请问有什么可以帮您的吗？?" },
            { role: "user", content: "请问如何处理MDX文档?" },
            { role: "assistant", content: MarkdownDemoData() },
          ],
          updated_at: "2024-01-01T10:00:00.000Z",
          created_at: "2024-01-01T10:00:00.000Z",
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
        if (conversation.id !== selectedConversation){
          return conversation;
        }

        // 是当前对话
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

          
          // 更新 session title
          if (conversation.messages.length === 0 && role === "user") {
            // 用户的第一条消息，需要把当前conversation的title修改为用户消息（取前20个字）
            conversation.title = message.substring(0, 20);
            try {
              // 异步更新数据库的 session title
              updateConversation(conversation.id, conversation);
            } catch (e) {
              console.error("updateConversation error", e);
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
      });
    });
  }

  async function deleteConversation(id: string) {
    const result = await wrapDeleteSession(id);
    console.log("delete session id:", result);
    setConversations((conversations) => {
      const newConvs = conversations.filter(
        (conversation) => conversation.id !== id
      );
      if (newConvs.length > 0) {
        // update selected conv, if delete id === current selected id
        if (id === selectedConversation) {
          handleSelectConversation(newConvs[0].id);
        }
      }
      return newConvs;
    });
  }

  async function updateConversation(id: string, conv: Conversation) {
    const updatedConv = await wrapUpdateSession(conv);

    setConversations((conversations) => {
      return conversations.map((conversation) => {
        if (conversation.id === id) {
          return {
            ...conversation,
            ...updatedConv,
            // TODO should use updatedConv.updateAt
            updatedAt: conversation.updated_at,
          };
        }
        return conversation;
      });
    });
  }

  async function newConversation(prompt_id: number) {
    const result = await wrapNewSession({
      id: "",
      title: "新会话",
      prompt_id: prompt_id,
      with_context: false,
      with_context_size: 10,
      session_model: "gpt-4o-mini",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    console.log("new session result", result);
    if (result) {
      setConversations((conversations) => {
        return [
          {
            id: result.id,
            title: "新会话",
            prompt_id: 1,
            messages: [],
            with_context: false,
            with_context_size: 10,
            session_model: "gpt-4o-mini",
            created_at: result.created_at,
            updated_at: result.updated_at,
          },
          ...conversations,
        ].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
      });
      handleSelectConversation(result.id);
    }
  }

  // ----------------- openAI part -------------------

  // 是否增在输出
  const [isResponsing, setIsResponsing] = useState(false);
  // 是否忽略
  const [_, setIsIgnoreResponse] = useState(false);

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
    }).then(async (assistant_message) => {
      setIsResponsing(false);
      console.log("to saved user message:", message);

      // 需要保持顺序，这个和显示顺序有关
      await wrapSaveSessionData(selectedConversation, {
        id: 0,
        session_id: selectedConversation,
        message: message,
        role: "user",
        message_type: "text",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // 需要保持顺序，这个和显示顺序有关
      await wrapSaveSessionData(selectedConversation, {
        id: 0,
        session_id: selectedConversation,
        message: assistant_message|| "<not-responsed>",
        role: "assistant",
        message_type: "text",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log(`save session data: ${assistant_message}`);
      console.log(`use-openai.tsx handle the message done: ${message}`);
    });
  }

  // 立即停止
  function handleStopResponsing() {
    setIsIgnoreResponse(true);
    setIsResponsing(false);
  }

  return {
    conversations,
    setConversations,
    setSelectedConversation,
    selectedConversation,
    handleSelectConversation,
    handleCreateConversation,
    handleDeleteConversation,
    getConvMessage,
    handleSendMessage,
    handleStopResponsing,
    isResponsing,
  };
}
