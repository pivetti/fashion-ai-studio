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
      <p className="text-sm font-medium text-[#F4EBDD]">{label}</p>
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
                  ? "rounded-2xl border border-[#5C4724] bg-[#1A1712] px-3 py-2.5 text-left text-sm font-semibold text-[#E3C98A] shadow-[0_0_0_1px_rgba(200,169,110,0.08)]"
                  : "rounded-2xl border border-[#28241C] bg-[#15130F] px-3 py-2.5 text-left text-sm font-medium text-[#A9A096] transition hover:border-[#5C4724] hover:text-[#F4EBDD]"
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
