"use client";

import type { TraceStep } from "@/lib/types";

export default function AgentTrace({ trace }: { trace: TraceStep[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Agent Trace
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          {trace.length > 0
            ? `${trace.length} step${trace.length === 1 ? "" : "s"} in last request`
            : "How the agent thinks and acts"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {trace.length === 0 ? (
          <div className="text-sm text-zinc-500 space-y-3">
            <p>
              This panel shows the agent loop in real time:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs">
              <li>Receive your message</li>
              <li>Decide which tool to call</li>
              <li>Execute the tool and read the result</li>
              <li>Repeat until the goal is done</li>
              <li>Reply with a summary</li>
            </ol>
          </div>
        ) : (
          <ol className="relative space-y-0">
            {trace.map((step, i) => (
              <li key={i} className="relative animate-fade-in pb-4 last:pb-0">
                {i < trace.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--border)]" />
                )}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)]">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border-b border-[var(--border)]">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          step.type === "tool_use"
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-emerald-400 bg-emerald-400/10"
                        }`}
                      >
                        {step.type === "tool_use" ? "TOOL CALL" : "RESPONSE"}
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      {step.type === "tool_use" && (
                        <>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500">
                              Tool
                            </span>
                            <p className="text-sm font-mono text-amber-300">
                              {step.toolName}()
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500">
                              Input
                            </span>
                            <pre className="text-xs font-mono text-zinc-400 bg-zinc-900/50 rounded p-2 mt-0.5 overflow-x-auto">
                              {JSON.stringify(step.toolInput, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500">
                              Result
                            </span>
                            <pre className="text-xs font-mono text-zinc-400 bg-zinc-900/50 rounded p-2 mt-0.5 overflow-x-auto">
                              {JSON.stringify(step.toolResult, null, 2)}
                            </pre>
                          </div>
                        </>
                      )}

                      {step.type === "text" && step.content && (
                        <p className="text-sm text-zinc-300">{step.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
