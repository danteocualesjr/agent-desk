import Anthropic from "@anthropic-ai/sdk";
import {
  addTask,
  completeTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./store";
import type { AgentResponse, TraceStep } from "./types";

const SYSTEM_PROMPT = `You are the AI agent powering Agent Desk, a task management app.

Your job is to help users manage their tasks using the tools available to you.

Rules:
- Always use tools to read or change task state — never pretend you made changes without calling a tool.
- Call list_tasks before bulk changes when you don't know the current state.
- Keep final replies concise and friendly. Confirm what you did.
- When adding multiple tasks, call add_task once per task.
- Priorities are: low, medium, high.`;

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "list_tasks",
    description: "List all tasks on the board, including completed ones.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "add_task",
    description: "Create a new task.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Task title" },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Task priority (default: medium)",
        },
        notes: { type: "string", description: "Optional notes" },
      },
      required: ["title"],
    },
  },
  {
    name: "update_task",
    description: "Update an existing task by ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Task ID" },
        title: { type: "string", description: "New title" },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "New priority",
        },
        notes: { type: "string", description: "New notes" },
      },
      required: ["id"],
    },
  },
  {
    name: "complete_task",
    description: "Mark a task as done by ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Task ID to complete" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_task",
    description: "Delete a task by ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Task ID to delete" },
      },
      required: ["id"],
    },
  },
];

function executeTool(
  name: string,
  input: Record<string, unknown>
): unknown {
  switch (name) {
    case "list_tasks":
      return getTasks();
    case "add_task":
      return addTask(
        input.title as string,
        (input.priority as "low" | "medium" | "high") ?? "medium",
        (input.notes as string) ?? ""
      );
    case "update_task":
      return updateTask(input.id as string, {
        title: input.title as string | undefined,
        priority: input.priority as "low" | "medium" | "high" | undefined,
        notes: input.notes as string | undefined,
      });
    case "complete_task":
      return completeTask(input.id as string);
    case "delete_task":
      return deleteTask(input.id as string);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

export async function runAgent(userMessage: string): Promise<AgentResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key."
    );
  }

  const client = new Anthropic({ apiKey });
  const trace: TraceStep[] = [];
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  let reply = "";
  const maxSteps = 8;

  for (let step = 1; step <= maxSteps; step++) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOL_DEFINITIONS,
      messages,
    });

    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );

    if (textBlocks.length > 0) {
      const text = textBlocks.map((b) => b.text).join("\n");
      trace.push({ step, type: "text", content: text });
      reply = text;
    }

    if (toolUseBlocks.length === 0 || response.stop_reason === "end_turn") {
      break;
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const toolUse of toolUseBlocks) {
      const result = executeTool(
        toolUse.name,
        toolUse.input as Record<string, unknown>
      );

      trace.push({
        step,
        type: "tool_use",
        toolName: toolUse.name,
        toolInput: toolUse.input as Record<string, unknown>,
        toolResult: result,
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  return {
    reply: reply || "Done.",
    trace,
    tasks: getTasks(),
  };
}
