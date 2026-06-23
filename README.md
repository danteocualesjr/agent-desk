# Agent Desk

A demo app that shows how an AI agent works — powered by Claude.

## What it demonstrates

- **Goal-directed behavior** — tell the agent what you want in plain English
- **Tool use** — the agent calls structured functions to read and change app state
- **The agent loop** — observe → decide → act → observe again until done

## Setup

```bash
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo phrases

- "Add tasks: write slides, rehearse demo, send calendar invite"
- "What's on my plate?"
- "Mark slides done and bump rehearsal to high priority"
