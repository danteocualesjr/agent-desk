import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const message =
      body && typeof body === "object" && "message" in body
        ? (body as { message: unknown }).message
        : undefined;

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
