import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function buttonClassName(variant: ButtonVariant = "primary") {
  const base =
    "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#C8A96E] via-[#d8bd83] to-[#a07840] text-black shadow-[0_14px_40px_rgba(200,169,110,0.18)] hover:brightness-110",
    secondary:
      "border border-[#333] bg-[#111] text-[#e0d5c5] hover:border-[#C8A96E]/60 hover:bg-[#171717]",
    ghost:
      "text-[#b6aa96] hover:bg-[#111] hover:text-[#C8A96E]",
    danger:
      "border border-red-500/40 bg-red-950/40 text-red-100 hover:bg-red-900/50",
  };

  return `${base} ${variants[variant]}`;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={`${buttonClassName(variant)} ${className}`} {...props}>
      {children}
    </button>
  );
}
