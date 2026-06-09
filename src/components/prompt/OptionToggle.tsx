"use client";

import type { PromptOption } from "@/types/prompt";

type OptionToggleProps = {
  label: string;
  onChange: (value: string) => void;
  options: PromptOption[];
  value: string;
};

export function OptionToggle({
  label,
  onChange,
  options,
  value,
}: OptionToggleProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-amber-100">{label}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                active
                  ? "rounded-md border border-amber-300 bg-amber-300 px-3 py-2 text-left text-sm font-medium text-neutral-950 shadow-sm"
                  : "rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-sm font-medium text-neutral-200 transition hover:border-amber-300/50 hover:bg-white/10"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
