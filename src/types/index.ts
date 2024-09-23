import type { SessionData, Session } from "@/rust-bindings";

  export interface Message extends SessionData {
    role: Role;
    content: string;
  }
  
  export type Role = 'assistant' | 'user';
  
  export interface ChatFolder {
    id: number;
    name: string;
  }
  
  export interface Conversation extends Session {
    folderId: number;
  }
  
  export interface ChatBody {
    messages: Message[];
    prompt: string;
  }


export * from "./_session-data"
export * from "./_session"
export * from "./_prompt"
export * from "./_settings"
export * from "./_conversation"
