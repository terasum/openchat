import { SessionData } from "./session-data-model";
import type { Session as S } from "@/rust-bindings";
export interface Session extends S {
  messages: SessionData[];
}
