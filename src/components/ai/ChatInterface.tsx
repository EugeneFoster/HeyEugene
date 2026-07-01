"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Tenant } from "@/lib/types";
import { IconSend, IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  tenants: Tenant[];
}

const STORAGE_KEY = "heyeugene-ai-chat";

export function ChatInterface({ tenants }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          tenant_id: tenantId || null,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content ?? data.error ?? "No response" },
      ]);
    } catch {
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <label className="text-sm font-medium">Context: </label>
        <select
          className="ml-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        >
          <option value="">All projects</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Ask me to write proposals, estimate tasks, draft emails, or generate changelog entries.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 text-sm ${
              msg.role === "user"
                ? "ml-8 bg-blue-50"
                : "mr-8 bg-gray-50"
            }`}
          >
            <p className="mb-1 text-xs font-medium text-[var(--text-secondary)]">
              {msg.role === "user" ? "Eugene" : "AI"}
            </p>
            {msg.role === "assistant" ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            )}
            {msg.role === "assistant" && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(msg.content);
                  toast.success("Copied to clipboard");
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <IconCopy size={12} /> Copy
              </button>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            type="button"
            onClick={send}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <IconSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
