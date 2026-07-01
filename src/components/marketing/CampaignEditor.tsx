"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function CampaignEditor() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);

  if (preview) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setPreview(false)}
          className="mb-4 rounded-lg bg-gray-100 px-4 py-2 text-sm"
        >
          Edit
        </button>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--text-secondary)]">Subject: {subject}</p>
          <div className="prose prose-sm mt-4 max-w-none">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Campaign name</label>
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Subject</label>
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Body (markdown)</label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Preview
        </button>
        <button
          type="button"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Save Draft
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          title="Email sending via Resend — configure later"
        >
          Send (coming soon)
        </button>
      </div>
    </div>
  );
}
