import type { SessionData as SD } from "@/rust-bindings";
export interface SessionData extends SD {
  role: "user" | "assistant" | "system";
}
