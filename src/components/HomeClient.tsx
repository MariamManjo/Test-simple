"use client";

import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { PromptBuilder } from "@/components/PromptBuilder";
import { PromptSidebar, type SavedPrompt } from "@/components/PromptSidebar";
import type { PromptFormState } from "@/lib/prompt";

export function HomeClient() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [builderKey, setBuilderKey] = useState(0);
  const [initialState, setInitialState] = useState<Partial<PromptFormState>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prompts");
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleSave = async (state: PromptFormState) => {
    setSaving(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (res.ok) {
        const saved = await res.json();
        setPrompts((prev) => [saved, ...prev]);
        setActiveId(saved.id);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (prompt: SavedPrompt) => {
    setActiveId(prompt.id);
    setInitialState({
      topic: prompt.topic,
      task: prompt.task,
      taskOther: prompt.taskOther ?? "",
      level: prompt.level,
      format: prompt.format,
      extra: prompt.extra ?? "",
    });
    setBuilderKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      if (activeId === id) {
        setActiveId(null);
        handleNew();
      }
    }
  };

  const handleNew = () => {
    setActiveId(null);
    setInitialState({});
    setBuilderKey((k) => k + 1);
  };

  return (
    <div className="flex min-h-dvh bg-[#f7f5f0]">
      <PromptSidebar
        prompts={prompts}
        activeId={activeId}
        loading={loading}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onNew={handleNew}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#e8e4dc] bg-[#f7f5f0]/95 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-[#e8e4dc] bg-white px-3 py-2 text-sm font-medium lg:hidden"
            >
              History
            </button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-[#2d6a4f] sm:text-2xl">
                Ask AI Better
              </h1>
              <p className="hidden text-xs text-[#5c5c5c] sm:block">
                Build clear prompts for any AI chat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden max-w-[140px] truncate text-[#5c5c5c] sm:inline">
              {session?.user?.email}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-[#e8e4dc] bg-white px-3 py-2 font-medium hover:bg-[#f7f5f0]"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 lg:px-6">
          <PromptBuilder
            key={builderKey}
            initialState={initialState}
            onSave={handleSave}
            saving={saving}
          />
        </main>
      </div>
    </div>
  );
}
