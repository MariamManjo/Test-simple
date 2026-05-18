"use client";

import { formatPromptDate } from "@/lib/prompt";

export type SavedPrompt = {
  id: string;
  content: string;
  topic: string;
  task: string;
  taskOther?: string | null;
  level: string;
  format: string;
  extra?: string | null;
  createdAt: string;
};

type PromptSidebarProps = {
  prompts: SavedPrompt[];
  activeId: string | null;
  loading: boolean;
  onSelect: (prompt: SavedPrompt) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function PromptSidebar({
  prompts,
  activeId,
  loading,
  onSelect,
  onDelete,
  onNew,
  mobileOpen,
  onCloseMobile,
}: PromptSidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close history"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col border-r border-[#e8e4dc] bg-white shadow-lg transition-transform duration-200 lg:static lg:z-0 lg:w-72 lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-[#e8e4dc] p-4">
          <h2 className="font-semibold text-[#1b4332]">Your prompts</h2>
          <button
            type="button"
            onClick={onNew}
            className="rounded-lg bg-[#2d6a4f] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1b4332]"
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <p className="p-3 text-sm text-[#5c5c5c]">Loading…</p>
          ) : prompts.length === 0 ? (
            <p className="p-3 text-sm text-[#5c5c5c]">
              Saved prompts appear here after you copy one.
            </p>
          ) : (
            <ul className="space-y-1">
              {prompts.map((p) => (
                <li key={p.id}>
                  <div
                    className={[
                      "group rounded-lg border transition",
                      activeId === p.id
                        ? "border-[#2d6a4f] bg-[#d8f3dc]"
                        : "border-transparent hover:border-[#e8e4dc] hover:bg-[#f7f5f0]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(p);
                        onCloseMobile();
                      }}
                      className="w-full px-3 py-2.5 text-left"
                    >
                      <p className="truncate text-sm font-medium text-[#1a1a1a]">
                        {p.topic}
                      </p>
                      <p className="mt-0.5 text-xs text-[#5c5c5c]">
                        {formatPromptDate(p.createdAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(p.id);
                      }}
                      className="mx-3 mb-2 hidden w-[calc(100%-1.5rem)] rounded-md border border-[#e8e4dc] py-1 text-xs text-[#5c5c5c] group-hover:block hover:border-red-300 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
