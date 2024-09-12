import { MarkdownDemoData } from "@/lib/data/markdown-demo";
import { Session, SessionData } from "@/model";

import {
  wrapGetSessionList,
  wrapNewSession,
  wrapDeleteSession,
  wrapUpdateSession,
  wrapGetSessionDataById,
  wrapSaveSessionData,
} from "@/rust-bindings";

/**
 * 获取指定页面的会话列表
 * @pure
 * @param start 开始数据条数
 * @param offset 结束数据条数
 * @returns conversation list = session[]
 */
export async function fetchSessions(
  start: number = 0,
  offset: number = 100
): Promise<Session[]> {
  // 请求 invoke rust 接口
  const res = await wrapGetSessionList(start, offset);
  if (!res) {
    return [];
  }

  if (!(res instanceof Array)) {
    console.error("(fetchConversation): res is not an array");
    return [];
  }

  const sessionList = res as unknown as Session[];

  sessionList.push({
    id: "markdown-format",
    title: "Markdown formatter",
    prompt_id: 1,
    with_context: false,
    with_context_size: 0,
    session_model: "gpt-4o-mini",

    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  });

  return sessionList.sort(
    (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

/**
 * insertSession 数据库中插入会话
 * @param session 会话 = conversaton
 * @returns
 */
export async function insertSession(session: Session): Promise<Session> {
  return await wrapNewSession(session);
}

export async function deleteSession(id: string): Promise<Session> {
  return await wrapDeleteSession(id);
}

export async function updateSession(session: Session): Promise<Session> {
  return await wrapUpdateSession(session);
}

export async function insertSessionData(
  session_data: SessionData
): Promise<void> {
  await wrapSaveSessionData(session_data.session_id, session_data);
}

/**
 * 返回当前选定的会话id的消息列表
 * @pure
 * @param conversations 会话列表
 * @param session_id 选择的会话id
 * @returns 返回当前选择的会话id对应的消息列表
 */
export async function fetchSessionDatasBySessionId(
  session_id: string
): Promise<SessionData[]> {
  // demo data
  if (session_id === "markdown-format") {
    return [
      {
        id: 1,
        role: "user",
        session_id: "markdown-format",
        message_type: "text",
        message: "请问如何处理MDX文档?",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        session_id: "markdown-format",
        message_type: "text",
        role: "assistant",
        message: MarkdownDemoData(),
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
      },
    ];
  }

  const session_data_list = await wrapGetSessionDataById(session_id);
  if (!session_data_list) {
    return [];
  }

  // 如果没有消息，则返回默认消息
  return session_data_list.length > 0
    ? session_data_list
    : ([
        {
          id: 0,
          role: "assistant",
          session_id: session_id,
          message_type: "text",
          message: "请问有什么可以帮您的吗?",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        }
    ] as SessionData[]);
}
