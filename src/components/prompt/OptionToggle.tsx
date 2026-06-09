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
      <p className="text-sm font-medium text-[#e0d5c5]">{label}</p>
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
                  ? "rounded-xl border border-[#C8A96E] bg-[#C8A96E]/12 px-3 py-2 text-left text-sm font-semibold text-[#C8A96E] shadow-[0_0_0_1px_rgba(200,169,110,0.08)]"
                  : "rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-left text-sm font-medium text-[#888] transition hover:border-[#C8A96E]/50 hover:text-[#e0d5c5]"
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
