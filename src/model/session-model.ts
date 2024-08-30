import { SessionData } from "./session-data-model";

export interface Session {
  id: number;
  title: string;
  messages: SessionData[];
  createdAt: Date;
}
