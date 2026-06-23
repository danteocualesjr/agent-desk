import type { Priority, Task } from "./types";

const tasks: Task[] = [
  {
    id: "1",
    title: "Prepare demo slides",
    priority: "high",
    notes: "Focus on agent loop visualization",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review pull requests",
    priority: "medium",
    notes: "",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export function getTasks(): Task[] {
  return [...tasks];
}

export function addTask(
  title: string,
  priority: Priority = "medium",
  notes = ""
): Task {
  const task: Task = {
    id: String(nextId++),
    title,
    priority,
    notes,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function updateTask(
  id: string,
  updates: Partial<Pick<Task, "title" | "priority" | "notes">>
): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  if (updates.title !== undefined) task.title = updates.title;
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.notes !== undefined) task.notes = updates.notes;
  return task;
}

export function completeTask(id: string): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.completed = true;
  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
