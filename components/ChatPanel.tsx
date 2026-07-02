"use client";

import { useState } from "react";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Add tasks: write slides, rehearse demo, send calendar invite",
  "What's on my plate?",
  "Mark slides done and bump rehearsal to high priority",
];

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatPanel({
  messages,
  onSend,
  loading,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Chat
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">
          Talk to the agent in plain English
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400 font-medium mb-1">Start a conversation</p>
            <p className="text-xs text-zinc-600 mb-4">Try one of these:</p>
            <div className="space-y-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  disabled={loading}
                  className="block w-full text-left text-xs text-zinc-400 hover:text-zinc-200 hover:border-[var(--accent)]/30 bg-[var(--panel)] border border-[var(--border)] rounded-lg px-3 py-2.5 transition-all disabled:opacity-50"
                >
                  &ldquo;{s}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-in flex gap-2 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                msg.role === "user"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-zinc-800 text-zinc-400 border border-[var(--border)]"
              }`}
            >
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div
              className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-[var(--accent)] text-white rounded-tr-sm"
                  : "bg-[var(--panel)] border border-[var(--border)] rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="animate-fade-in flex gap-2">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-[var(--border)]">
              AI
            </div>
            <div className="inline-flex items-center gap-2 bg-[var(--panel)] border border-[var(--border)] rounded-xl rounded-tl-sm px-4 py-3 text-sm text-zinc-400">
              <span className="flex gap-1">
                <span className="typing-dot inline-block w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                <span className="typing-dot inline-block w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                <span className="typing-dot inline-block w-1.5 h-1.5 bg-zinc-500 rounded-full" />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[var(--border)] bg-[var(--panel)]/40"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell the agent what to do..."
            disabled={loading}
            className="flex-1 bg-[var(--panel)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-10 h-10 bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-2 text-center">
          Press Enter to send
        </p>
      </form>
    </div>
  );
}
