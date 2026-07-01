import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getTenants, getTickets } from "@/lib/queries";

const MODEL = "claude-sonnet-4-20250514";
const INPUT_COST_PER_M = 3;
const OUTPUT_COST_PER_M = 15;

export async function POST(request: Request) {
  const { messages, tenant_id } = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  let systemPrompt =
    "You are Eugene's developer assistant for HeyEugene client projects. Help with proposals, estimates, changelog entries, client emails, and marketing copy. Be concise and professional.";

  if (tenant_id) {
    const tenants = await getTenants();
    const tickets = await getTickets(tenant_id);
    const tenant = tenants.find((t) => t.id === tenant_id);
    if (tenant) {
      systemPrompt += `\n\nCurrent project: ${tenant.name} (${tenant.emoji}), rate $${tenant.hourly_rate}/hr ${tenant.currency}.`;
      const recent = tickets.slice(0, 5);
      if (recent.length) {
        systemPrompt += `\nRecent tickets:\n${recent.map((t) => `- [${t.status}] ${t.title}`).join("\n")}`;
      }
    }
  }

  if (!apiKey) {
    return NextResponse.json({
      content:
        "AI assistant is not configured yet. Add `ANTHROPIC_API_KEY` to `.env.local`.\n\nBased on your request, I'd help draft professional client-facing content here.",
      mock: true,
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  const content =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";
  const inputTokens = data.usage?.input_tokens ?? 0;
  const outputTokens = data.usage?.output_tokens ?? 0;
  const costUsd =
    (inputTokens / 1_000_000) * INPUT_COST_PER_M +
    (outputTokens / 1_000_000) * OUTPUT_COST_PER_M;

  const supabase = createServiceClient();
  if (supabase && tenant_id) {
    await supabase.from("dev_ai_usage").insert({
      tenant_id,
      model: MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: costUsd,
      purpose: "ai_assistant",
    });
  }

  return NextResponse.json({ content, usage: data.usage });
}
