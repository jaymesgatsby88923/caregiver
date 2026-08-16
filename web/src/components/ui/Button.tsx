import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "pill";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--red)] text-white hover:bg-[var(--red-dark)] border-none",
  secondary:
    "bg-white text-[var(--navy)] border-[1.5px] border-[var(--navy)] hover:bg-[var(--soft-blue)]",
  ghost:
    "bg-transparent text-[var(--navy)] border border-[var(--border)] hover:bg-[var(--soft-blue)]",
  pill: "bg-[var(--red)] text-white hover:bg-[var(--red-dark)] border-none rounded-full",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
