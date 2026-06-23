export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface TraceStep {
  step: number;
  type: "tool_use" | "text";
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolResult?: unknown;
  content?: string;
}

export interface AgentResponse {
  reply: string;
  trace: TraceStep[];
  tasks: Task[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
