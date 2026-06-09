import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full resize-y rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-3 text-sm leading-6 text-[#f0e6d0] outline-none transition placeholder:text-[#555] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/15 ${className}`}
      {...props}
    />
  );
}
