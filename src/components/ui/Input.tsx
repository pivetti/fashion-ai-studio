import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 text-sm text-[#f0e6d0] outline-none transition placeholder:text-[#555] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/15 ${className}`}
      {...props}
    />
  );
}
