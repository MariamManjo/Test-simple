"use client";

type ChipOption = { value: string; label: string; wide?: boolean };

type ChipGroupProps = {
  options: readonly ChipOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: "task" | "level" | "format";
  ariaLabel: string;
};

const columnClass: Record<NonNullable<ChipGroupProps["columns"]>, string> = {
  task: "grid-cols-1 min-[400px]:grid-cols-2 min-[640px]:grid-cols-3",
  level: "grid-cols-1 min-[520px]:grid-cols-2",
  format: "grid-cols-1 min-[520px]:grid-cols-2",
};

export function ChipGroup({
  options,
  value,
  onChange,
  columns = "level",
  ariaLabel,
}: ChipGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`grid gap-2 ${columnClass[columns]}`}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? "" : opt.value)}
            className={[
              "flex min-h-12 items-center justify-center rounded-[10px] border-2 px-3 py-3 text-center text-sm font-medium transition",
              "touch-manipulation border-[#e8e4dc] bg-[#f7f5f0] text-[#1a1a1a]",
              "hover:border-[#2d6a4f] hover:bg-[#d8f3dc]",
              "active:scale-[0.97]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6a4f]",
              selected &&
                "border-[#2d6a4f] bg-[#d8f3dc] font-semibold text-[#1b4332] shadow-[0_0_0_1px_#2d6a4f]",
              opt.wide && columns === "task" && "min-[400px]:col-span-2 min-[640px]:col-span-3",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
