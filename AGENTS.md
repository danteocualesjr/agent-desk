# Agent Desk

A Next.js 15 (App Router) + React 19 + TypeScript demo app showing an AI agent loop. A chat message is sent to `/api/agent`, which runs Claude (`@anthropic-ai/sdk`) with task-management tools against an in-memory task store, and streams back a reply plus a step-by-step trace rendered in the UI.

## Cursor Cloud specific instructions

- Standard commands live in `package.json` scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm start`. See `README.md` for the intended user flow and demo phrases.
- The agent route (`/api/agent`) requires `ANTHROPIC_API_KEY`. Put it in `.env.local` (copy `.env.example`) or provide it as an environment secret. Without it, `POST /api/agent` returns `{"error":"ANTHROPIC_API_KEY is not set..."}` while the rest of the app (task board, `GET /api/tasks`) still works.
- The task store (`lib/store.ts`) is an in-memory module-level array. It resets whenever the dev/prod server restarts, and it is per-server-process (not per-user). Tasks added via the agent persist only for the life of the running server.
- Lint is not preconfigured: `npm run lint` (`next lint`) is interactive on first run because no ESLint config or `eslint` dependency ships in the repo. It prompts to create a config and would add dependencies. `next build` already runs TypeScript type-checking, which is the reliable correctness check here.
- `next dev` serves on port 3000. The agent model is pinned in `lib/agent.ts` (`claude-sonnet-4-20250514`).
