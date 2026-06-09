import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type CardProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: "default" | "soft" | "elevated";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "section">({
  as,
  children,
  className = "",
  variant = "default",
  ...props
}: CardProps<T>) {
  const Component = as ?? "section";
  const variants = {
    default: "border-[#28241C] bg-[#0F0F0D]",
    soft: "border-[#28241C] bg-[#15130F]",
    elevated: "border-[#3A3124] bg-[#1A1712]",
  };

  return (
    <Component
      className={`rounded-[1.35rem] border p-6 shadow-[0_28px_90px_rgba(0,0,0,0.22)] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
