import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full resize-y rounded-2xl border border-[#28241C] bg-[#15130F] px-4 py-3 text-sm leading-6 text-[#F4EBDD] outline-none transition placeholder:text-[#6F6A63] focus:border-[#5C4724] focus:ring-2 focus:ring-[#C8A96E]/15 ${className}`}
      {...props}
    />
  );
}
