"use client";

import { useCallback, useEffect, useState } from "react";
import AgentTrace from "@/components/AgentTrace";
import ChatPanel from "@/components/ChatPanel";
import TaskBoard from "@/components/TaskBoard";
import type { ChatMessage, Task, TraceStep } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState(0);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleSend(message: string) {
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    setTrace([]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setTrace(data.trace);
      setTasks(data.tasks);
      setStepCount(data.trace.length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Agent error";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Agent Desk</h1>
          <p className="text-xs text-zinc-500">
            A task board powered by an AI agent
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stepCount > 0 && (
            <span className="text-xs text-zinc-500">
              {stepCount} agent step{stepCount === 1 ? "" : "s"}
            </span>
          )}
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Powered by Claude Agent
          </span>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <main className="flex-1 grid grid-cols-3 divide-x divide-[var(--border)] overflow-hidden">
        <TaskBoard tasks={tasks} />
        <ChatPanel messages={messages} onSend={handleSend} loading={loading} />
        <AgentTrace trace={trace} />
      </main>
    </div>
  );
}
