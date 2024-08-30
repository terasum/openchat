export interface SessionData {
  id: number;
  role: "user" | "assistant"| "system";
  sessionId: number;
  message: string;
  createdAt: Date;
}
