"use client";

import { useState } from "react";

interface SubscribeFormProps {
  alertType: string;
  alertValue: string;
}

export function SubscribeForm({ alertType, alertValue }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, alertType, alertValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe.");
        return;
      }

      setStatus("success");
      setMessage("Check your email to verify your subscription.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred communicating with the server.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {status === "success" ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="text-xl">✅</span>
          <p className="text-green-800 dark:text-green-400 font-semibold text-sm">
            {message}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/40 outline-none transition-shadow text-sm disabled:opacity-50"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm flex items-center justify-center min-w-[120px] shadow-sm"
            >
              {status === "loading" ? (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium pl-1">
            We&apos;ll send you alerts when new notices match your subscription.
          </p>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold animate-in fade-in">
          {message}
        </p>
      )}
    </div>
  );
}
