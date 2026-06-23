import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await runAgent(message);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Agent error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
