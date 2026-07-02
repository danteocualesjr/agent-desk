"use client";

import type { Task } from "@/lib/types";

const priorityColors = {
  low: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  high: "text-red-400 bg-red-400/10 border-red-400/20",
};

const priorityIcons = {
  low: "↓",
  medium: "→",
  high: "↑",
};

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Task Board
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          {pending.length} active · {done.length} done
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pending.length === 0 && done.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-8">
            No tasks yet. Ask the agent to add some!
          </p>
        )}

        {pending.length > 0 && (
          <section>
            <h3 className="text-xs font-medium text-zinc-500 mb-2">To do</h3>
            <ul className="space-y-2">
              {pending.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}

        {done.length > 0 && (
          <section>
            <h3 className="text-xs font-medium text-zinc-500 mb-2">Done</h3>
            <ul className="space-y-2">
              {done.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <li
      className={`group rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 animate-fade-in transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border ${
            task.completed
              ? "bg-[var(--success)] border-[var(--success)]"
              : "border-zinc-600"
          } flex items-center justify-center text-[10px]`}
        >
          {task.completed && "✓"}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              task.completed ? "line-through text-zinc-500" : ""
            }`}
          >
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-zinc-500 mt-0.5">{task.notes}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                priorityColors[task.priority]
              }`}
            >
              <span>{priorityIcons[task.priority]}</span>
              {task.priority}
            </span>
            <span className="text-[10px] text-zinc-600">#{task.id}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
