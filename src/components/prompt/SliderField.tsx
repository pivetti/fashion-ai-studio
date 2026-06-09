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
    <label className="block rounded-lg border border-white/10 bg-white/5 p-4">
      <span className="flex items-center justify-between gap-4 text-sm font-medium text-amber-100">
        {label}
        <span className="rounded-md bg-neutral-950 px-2 py-1 text-xs text-amber-200">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="mt-4 w-full accent-amber-300"
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
