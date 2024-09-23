import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, ConversationMessage } from "@/types";
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
import { RootState } from "@/store";
import { ChatFolder } from "@/types";

interface ConversationState {
  selectedConversation: Conversation | null;
  conversationList: Conversation[];
  currentMsgList: ConversationMessage[];
  isResponsing: boolean;
  folders: ChatFolder[];
  fetchParams: {
    page: number;
    pageSize: number;
  };
}

const initialState: ConversationState = {
  selectedConversation: null,
  conversationList: [],
  currentMsgList: [],
  isResponsing: false,
  folders: [],
  fetchParams: {
    page: 1,
    pageSize: 100,
  },
};

/**
 * 获取会话列表
 */
export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const convs = await fetchSessions(
      state.conversation.fetchParams.page,
      state.conversation.fetchParams.pageSize
    );

    if (convs.length > 0) {
      const selected = convs[0];
      // 设置选中的会话
      dispatch(setSelectedConversation(selected as Conversation));
      return {
        selected,
        convs: convs.sort(
          (a, b) => Date.parse(a.updated_at) - Date.parse(b.updated_at)
        ),
      };
    }
    return {
      selected: null,
      convs: [],
    };
  }
);

export const setSelectedConversation = createAsyncThunk(
  "conversation/setSelectedConversation",
  async (conversation: Conversation, { dispatch }) => {
    const dataList = await fetchSessionDatasBySessionId(conversation.id);
    return { conversation, dataList };
  }
);

/**
 * 更新会话
 */
export const updateConversationAsync = createAsyncThunk(
  "conversation/updateConversation",
  async (conversation: Conversation, {}) => {
    return await updateSession(conversation);
  }
);

export const clearConversations = createAsyncThunk(
  "conversation/clearConversations",
  async (_, { dispatch }) => {
    dispatch(clearConversations());
  }
);

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async (_, { dispatch }) => {
    const newConv = {
      id: random_id(18),
      title: "新会话",
      prompt_id: 1,
      with_context: false,
      with_context_size: 10,
      session_model: "gpt-4o-mini",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Conversation;

    const newConvRet = await insertSession(newConv);
    const dataList = await fetchSessionDatasBySessionId(newConvRet.id);
    return { conversation: newConvRet as Conversation, dataList };
  }
);

export const deleteConversation = createAsyncThunk(
  "conversation/deleteConversation",
  async (id: string, { getState }) => {
    const deleted = await deleteSession(id);
    const state = (getState() as RootState).conversation;
    let latestConv = state.conversationList[state.conversationList.length - 1];
    for (let i = state.conversationList.length - 1; i >= 0; i--) {
      if (state.conversationList[i].id !== id) {
        latestConv = state.conversationList[i];
        break;
      }
    }

    const dataList = await fetchSessionDatasBySessionId(latestConv.id);
    console.log("deleteConversation", { latestConv, dataList });
    return { conversation: deleted as Conversation, dataList, latestConv };
  }
);

export const sendMessage = createAsyncThunk(
  "conversation/sendMessage",
  async (message: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { selectedConversation, currentMsgList } = state.conversation;
    const { activatedPrompt } = state.prompts;
    const config = state.appConfig;
    const newUserMsg = {
      id: 0,
      session_id: selectedConversation?.id,
      message,
      role: "user",
      message_type: "text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ConversationMessage;
    await insertSessionData(newUserMsg);
    if (selectedConversation?.title === "新会话") {
      dispatch(
        updateConversationAsync({
          ...selectedConversation,
          title: message.slice(0, 10),
        })
      );
    }
    dispatch(addMessage(newUserMsg));

    const contexts = currentMsgList.map((msg) => ({
      role: msg.role,
      content: msg.message,
    }));

    contexts.push({ role: "user", content: message });

    if (activatedPrompt.system) {
      contexts.unshift({ role: "system", content: activatedPrompt.system });
    }

    const upadteContentFn = () => {
      let pendingQueue: string[] = [""];
      let result = "";
      let isFinished = false;

      let inv = setInterval(() => {
        let update = pendingQueue.shift();
        if (!update) return;
        result += update;
        dispatch(updateLastMessage(result));
        if (isFinished && pendingQueue.length === 0) {
          clearInterval(inv);
        }
      }, 10);

      return {
        updateFn: (chunk: string) => {
          answer += chunk;
          pendingQueue.push(...chunk.split(""));
        },
        clearFn: () => {
          isFinished = true;
        },
      };
    };

    let { updateFn, clearFn } = upadteContentFn();

    let answer = "";
    const onUpdate = (chunk: string) => {
      answer += chunk;
      updateFn(chunk);
    };

    const onDone = async (assistant_message: string) => {
      console.log("onDone", { assistant_message });
      clearFn();
      const assistant_record = {
        id: 0,
        session_id: selectedConversation?.id,
        message: assistant_message,
        role: "assistant",
        message_type: "text",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ConversationMessage;
      await insertSessionData(assistant_record);
      dispatch(setIsResponsing(false));
    };

    const onError = (e: Error) => {
      dispatch(setIsResponsing(false));
      console.error("stream error", e);
    };

    const requestOpts = {
      api_key: config.model.api_key,
      model: config.model.model_name,
      temprature: Number(activatedPrompt.temperature),
      max_tokens: Number(activatedPrompt.max_tokens),
      url: config.model.api_url,
      top_p: 1,
      stream: true,
    };

    try {
      await chatWithOpenAI(contexts, onUpdate, onDone, onError, requestOpts);
    } catch (e: any) {
      console.error("catched error", { error: e });
      onError(e);
      if (e.message.includes("Unauthorized")) {
        const invalidApiKeyTip = "您的 api-key 无效, 请重新获取!";
        updateFn(invalidApiKeyTip);
        setTimeout(() => {
          onDone(invalidApiKeyTip);
        }, 10);
      }
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setCurrentMsgList(state, action: PayloadAction<ConversationMessage[]>) {
      state.currentMsgList = action.payload;
    },
    addMessage(state, action: PayloadAction<ConversationMessage>) {
      state.currentMsgList.push(action.payload);
    },
    updateLastMessage(state, action: PayloadAction<string>) {
      const lastMessage = state.currentMsgList[state.currentMsgList.length - 1];
      if (lastMessage.role === "assistant") {
        lastMessage.message = action.payload;
      } else {
        state.currentMsgList.push({
          id: 0,
          session_id: state.selectedConversation?.id,
          message: action.payload,
          role: "assistant",
          message_type: "text",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as ConversationMessage);
      }
    },
    setIsResponsing(state, action: PayloadAction<boolean>) {
      state.isResponsing = action.payload;
    },
    clearConversations: (state) => {
      state.conversationList = [];
      state.selectedConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        const { selected, convs } = action.payload;
        state.conversationList = convs.map((conv) => ({
          ...conv,
          folderId: 0,
        }));
        state.selectedConversation = selected as Conversation;
      })
      .addCase(setSelectedConversation.fulfilled, (state, action) => {
        const { conversation, dataList } = action.payload;
        state.selectedConversation = conversation as Conversation;
        state.currentMsgList = dataList;
      })
      .addCase(updateConversationAsync.fulfilled, (state, action) => {
        const conversation = action.payload;
        state.selectedConversation = conversation as Conversation;
        state.conversationList.map((conv) => {
          if (conv.id === conversation.id) {
            conv = { ...conv, ...conversation };
          }
        });
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const { conversation, dataList } = action.payload;
        conversation.folderId = 0;
        state.conversationList.push(conversation);
        state.selectedConversation = conversation;
        state.currentMsgList = dataList;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const { conversation, dataList, latestConv } = action.payload;
        state.conversationList = state.conversationList.filter(
          (conv) => conv.id !== conversation.id
        );
        state.selectedConversation = latestConv;
        state.currentMsgList = dataList;
      });
  },
});

export const {
  setCurrentMsgList,
  addMessage,
  updateLastMessage,
  setIsResponsing,
} = conversationSlice.actions;

export default conversationSlice.reducer;
