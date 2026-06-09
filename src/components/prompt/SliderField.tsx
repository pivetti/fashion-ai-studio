"use client";

type SliderFieldProps = {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  suffix: string;
  value: number;
};

export function SliderField({
  label,
  max,
  min,
  onChange,
  step = 1,
  suffix,
  value,
}: SliderFieldProps) {
  return (
    <label className="block rounded-2xl border border-[#28241C] bg-[#15130F] p-4">
      <span className="flex items-center justify-between gap-4 text-sm font-medium text-[#F4EBDD]">
        {label}
        <span className="rounded-full border border-[#5C4724] bg-[#C8A96E]/10 px-3 py-1 text-xs text-[#E3C98A]">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="mt-4 w-full"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}
