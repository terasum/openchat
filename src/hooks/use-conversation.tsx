import { Session, SessionData } from "@/model";
import { useState, useEffect } from "react";

import {
  fetchSessions,
  fetchSessionDatasBySessionId,
  insertSession,
  deleteSession,
  insertSessionData,
  updateSession,
} from "@/api/session";

import { chatWithOpenAI } from "@/api/openai";
import { debounce, random_id } from "@/lib/utils";
import { produce } from "immer";
import { useAppSettings } from "@/hooks/use-app-config";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import { asyncPromptActiveFetch } from "@/store/prompts";

export interface ConvData extends SessionData {}
export interface Conv extends Session {}

/**
 * useConversation 会话逻辑 hooks
 * @returns conversation 会话相关成员
 */
export function useConversation() {
  // 当前选择对话
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  //当前会话列表
  const [conversationList, setConverList] = useState<Conv[]>([]);
  // 当前的消息列表
  const [currentMsgList, setConverMsgList] = useState<ConvData[]>([]);

  // 是否正在输出
  const [isResponsing, setIsResponsing] = useState(false);

  const dispatch = useAppDispatch();
  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );

  const { config } = useAppSettings();

  useEffect(() => {
    dispatch(asyncPromptActiveFetch());
  }, []);

  /**
   * handleSelectConversation 处理选择某个会话
   * @param id 会话ID
   */
  const handleSelectConver = async (id: string) => {
    console.log("[hooks]handleSelectConversation| start:", id);
    const dataList = await fetchSessionDatasBySessionId(id);
    console.log("[hooks]handleSelectConversation | dataList:", dataList);
    setConverMsgList(dataList);
    setSelectedConvId(id);
    console.log("[hooks]handleSelectConversation| end:", id);
  };

  /**
   * handleCreateNewConversation 新建一个会话
   * @param prompt_id 默认为1
   */
  const handleCreateConver = async () => {
    console.log("[hooks] handleCreateConversation");
    const newConv = {
      id: random_id(18),
      title: "新会话",
      prompt_id: 1,
      with_context: false,
      with_context_size: 10,
      session_model: "gpt-4o-mini",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Conv;

    const insertedConv = await insertSession(newConv);

    setConverList(
      produce((draft) => {
        draft.unshift(insertedConv);
        // 要放在这个函数里面
        handleSelectConver(insertedConv.id);
      })
    );
  };

  /**
   * handleDeleteConversation 处理删除会话
   * @param id 删除的会话ID
   */
  const handleDeleteConver = async (id: string) => {
    console.log("[hook] handleDeleteConversation | deleted:", id);
    await deleteSession(id);
    setConverList((draft) => {
      const newlist = draft.filter((conv) => conv.id !== id);
      // 设置为未选中
      if (id === selectedConvId && newlist.length > 0) {
        setSelectedConvId(newlist[0].id);
      }
      return newlist;
    });
  };

  /**
   * handleSendMessage 发送请求到openai
   * @param message 处理openAI请求消息发送
   */
  async function handleSendMessage(message: string) {
    console.log(`[hooks] handle the message: ${message}`);
    // 正在输出状态
    setIsResponsing(true);

    // 构造会话消息列表，插入用户消息
    // update 之后，数据库和状态都会一并更新
    // await updateCurrentConversation("user", message);
    const newUserMsg = {
      id: 0,
      session_id: selectedConvId,
      message,
      role: "user",
      message_type: "text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log("[hook]insertSessionData", newUserMsg);
    await insertSessionData(newUserMsg);
    setConverMsgList((prevList) => {
      // 处理首个消息title
      if (prevList.length === 1 && prevList[0].id === 0) {
        const currentConv = conversationList.filter(
          (item) => item.id === selectedConvId
        );
        if (currentConv.length > 0) {
          setConverList((prevList) => {
            return prevList.map((item) => {
              if (item.id === selectedConvId) {
                const pendingUpdateSession = {
                  ...item,
                  title: message.slice(0, 20),
                  updated_at: new Date().toISOString(),
                };
                // 更新标题
                try {
                  updateSession(pendingUpdateSession);
                } catch (e: any) {
                  console.log("更新session标题错误", e);
                }
                return pendingUpdateSession;
              }
              return item;
            });
          });
        }
      }

      return [...prevList, newUserMsg];
    });

    const contexts = currentMsgList.map((msg) => {
      return {
        role: msg.role,
        content: msg.message,
      };
    });
    contexts.push({
      role: "user",
      content: message,
    });
    // 添加系统 prompts
    if (activatedPrompt.system) {
      console.log("use-conversation.tsx", "unshift actived prompt", {
        activatedPrompt,
      });
      contexts.unshift({ role: "system", content: activatedPrompt.system });
      console.log(
        "use-conversation.tsx",
        "after unshift actived prompt, context: ",
        { contexts }
      );
    }

    const updateContent = debounce((content: string) => {
      setConverMsgList((prevList) => {
        const newList = [...prevList];
        const latest = prevList[prevList.length - 1];

        if (latest.role === "user") {
          const newAssistantMsg = {
            id: latest.id + 1,
            session_id: selectedConvId,
            message: content,
            role: "assistant",
            message_type: "text",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          newList.push(newAssistantMsg);
        } else {
          // console.log("[hook] openai onUpdate, chunk:", content);
          newList[newList.length - 1].message = content;
        }

        return newList;
      });
    }, 20);

    let answer = "";
    const onUpdate = (chunk: string) => {
      answer += chunk;
      updateContent(answer);
    };

    const onDone = async (assistant_message: string) => {
      console.log(`[hook] openai onDone: ${assistant_message}`);

      const assistant_record = {
        id: 0,
        session_id: selectedConvId,
        message: assistant_message,
        role: "assistant",
        message_type: "text",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 插入消息
      await insertSessionData(assistant_record);

      setIsResponsing(false);
      console.log(`use-openai.tsx handle the message done: ${message}`);
    };

    const onError = (e: Error) => {
      setIsResponsing(false);
      console.error("stream error", e);
    };

    console.log("use-conversation.tsx", "pass to openai's contexts:", {
      contexts,
    });
    console.log("use-conversation.tsx", "app-config", { config });

    // 请求AI
    await chatWithOpenAI(contexts, onUpdate, onDone, onError);
  }

  // 立即停止
  function handleStopResponsing() {
    setIsResponsing(false);
  }

  function getConvMessage() {
    return currentMsgList
      .map((msg) => {
        return {
          role: msg.role,
          content: msg.message,
          updated_at: msg.updated_at,
        };
      })
      .sort((a, b) => {
        return Date.parse(a.updated_at) - Date.parse(b.updated_at);
      });
  }

  function init() {
    // ----------------- openAI part -------------------
    // useConversation的时候，获取会话列表
    // 目前限制查询数量为 100 条数据
    console.log("use-conversation.tsx", "== init ==");

    fetchSessions(0, 10).then((convs) => {
      console.log("use-conversation.tsx", "fetchSessions", { convs });
      setConverList(
        convs.sort(
          (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
        )
      );
      if (convs.length > 0) {
        handleSelectConver(convs[0].id);
      } else {
        // TODO 应该默认新建一个
      }
    });
  }

  // 当前选择的 conversation id 变化时，自动更新消息列表
  useEffect(() => {
    const conv = conversationList.find((conv) => conv.id === selectedConvId);
    if (!conv) {
      return;
    }
    new Promise(async () => {
      const dataList = await fetchSessionDatasBySessionId(selectedConvId);
      setConverMsgList(dataList);
      console.log("use-conversation.tsx", "conversation list updated", {
        dataList,
      });
    });
  }, [selectedConvId]);

  return {
    initConvers: init,
    conversations: conversationList,
    setConversations: setConverList,
    setSelectedConversation: setSelectedConvId,
    selectedConversation: selectedConvId,
    isResponsing,
    currentMsgList,
    prompt,
    handleSelectConversation: handleSelectConver,
    handleCreateConversation: handleCreateConver,
    handleDeleteConversation: handleDeleteConver,
    handleSendMessage,
    handleStopResponsing,
    getConvMessage,
  };
}
