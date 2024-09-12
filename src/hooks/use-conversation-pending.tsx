import { Session, SessionData } from "@/model";
import { useState, useEffect, useCallback } from "react";

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
  const [conversationList, setConversationList] = useState<Conv[]>([]);
  // 当前的消息列表
  const [currentMsgList, setCurrentMsgList] = useState<ConvData[]>([]);

  // 是否正在输出
  const [isResponsing, setIsResponsing] = useState(false);

  /**
   * useEffect 初始化会话列表
   */
  useEffect(() => {
    console.log(
      "[hooks] ============== trigger use-conversation-pending render  ============"
    );
    // 目前限制查询数量为 100 条数据
    fetchSessions(0, 10).then((convs) => {
      console.log("[hooks]fetchSessions| convs:", convs);
      setConversationList(
        convs.sort(
          (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
        )
      );
      if (convs.length > 0) {
        handleSelectConversation(convs[0].id);
      } else {
        // TODO 应该默认新建一个
      }
    });

    if (!selectedConvId && conversationList.length > 0) {
      const id = conversationList[0].id;
      fetchSessionDatasBySessionId(id).then((dataList) => {
        console.log("[hooks]handleSelectConversation | dataList:", dataList);
        setCurrentMsgList(dataList);
        setSelectedConvId(id);
      });
    }
    console.log("[hooks] useConversation | currentMsgList:", currentMsgList);
  }, []);

  /**
   * handleSelectConversation 处理选择某个会话
   * @param id 会话ID
   */
  const handleSelectConversation = async (id: string) => {
    console.log("[hooks]handleSelectConversation| start:", id);
    const dataList = await fetchSessionDatasBySessionId(id);
    console.log("[hooks]handleSelectConversation | dataList:", dataList);
    setCurrentMsgList(dataList);
    setSelectedConvId(id);
    console.log("[hooks]handleSelectConversation| end:", id);
  };

  /**
   * handleCreateNewConversation 新建一个会话
   * @param prompt_id 默认为1
   */
  const handleCreateConversation = async () => {
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

    setConversationList(
      produce((draft) => {
        draft.unshift(insertedConv);
        // 要放在这个函数里面
        handleSelectConversation(insertedConv.id);
      })
    );
  };

  /**
   * handleDeleteConversation 处理删除会话
   * @param id 删除的会话ID
   */
  const handleDeleteConversation = async (id: string) => {
    console.log("[hook] handleDeleteConversation | deleted:", id);
    await deleteSession(id);
    setConversationList((draft) => {
      const newlist = draft.filter((conv) => conv.id !== id);
      // 设置为未选中
      if (id === selectedConvId && newlist.length > 0) {
        setSelectedConvId(newlist[newlist.length - 1].id);
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
    setCurrentMsgList((prevList) => {
      // 处理首个消息title
      if (prevList.length === 1 && prevList[0].id === 0) {
        const currentConv = conversationList.filter(
          (item) => item.id === selectedConvId
        );
        if (currentConv.length > 0) {
          setConversationList((prevList) => {
            return prevList.map((item) => {
              if (item.id === selectedConvId) {
                const pendingUpdateSession = {
                  ...item,
                  title: message.slice(0, 20),
                  updated_at: new Date().toISOString(),
                };
                updateSession(pendingUpdateSession);
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

    console.log("[hooks] handleSendMessage| contexts:", contexts);

    const updateContent = debounce((content: string) => {
      setCurrentMsgList((prevList) => {
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
          console.log("[hook] openai onUpdate, chunk:", content);
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

  // ----------------- openAI part -------------------

  return {
    conversations: conversationList,
    setConversations: setConversationList,
    setSelectedConversation: setSelectedConvId,
    selectedConversation: selectedConvId,
    isResponsing,
    currentMsgList,
    handleSelectConversation,
    handleCreateConversation,
    handleDeleteConversation,
    handleSendMessage,
    handleStopResponsing,
    getConvMessage,
  };
}
