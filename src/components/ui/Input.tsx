import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-11 w-full rounded-2xl border border-[#28241C] bg-[#15130F] px-4 text-sm text-[#F4EBDD] outline-none transition placeholder:text-[#6F6A63] focus:border-[#5C4724] focus:ring-2 focus:ring-[#C8A96E]/15 ${className}`}
      {...props}
    />
  );
}
