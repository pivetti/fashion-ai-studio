import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type CardProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "section">({
  as,
  children,
  className = "",
  ...props
}: CardProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={`rounded-2xl border border-[#1e1e1e] bg-[#111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
