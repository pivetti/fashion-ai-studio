import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function buttonClassName(variant: ButtonVariant = "primary") {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E] disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#E3C98A] via-[#C8A96E] to-[#8C6A32] text-[#080807] shadow-[0_16px_44px_rgba(200,169,110,0.16)] hover:brightness-105",
    secondary:
      "border border-[#28241C] bg-[#15130F] text-[#F4EBDD] hover:border-[#5C4724] hover:bg-[#1A1712]",
    ghost: "text-[#A9A096] hover:bg-[#15130F] hover:text-[#E3C98A]",
    danger:
      "border border-red-500/40 bg-red-950/30 text-red-100 hover:bg-red-900/45",
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
