import type { ReactNode } from "react";
import Button from "./Button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="serif m-0 text-3xl font-bold text-[var(--navy)]">{title}</h1>
        {subtitle && (
          <p className="mt-2 mb-0 text-base text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

type SummaryChipsProps = {
  items: { label: string; value: number; tone?: "default" | "active" | "inactive" }[];
};

export function SummaryChips({ items }: SummaryChipsProps) {
  const toneClass = (tone: SummaryChipsProps["items"][0]["tone"]) => {
    switch (tone) {
      case "active":
        return "border-green-200 bg-green-50 text-green-800";
      case "inactive":
        return "border-gray-200 bg-gray-50 text-gray-600";
      default:
        return "border-[var(--border)] bg-[var(--soft-blue)] text-[var(--navy)]";
    }
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${toneClass(item.tone)}`}
        >
          <span className="mr-2 font-bold">{item.value}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--cream)] px-8 py-16 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="serif m-0 text-xl font-bold text-[var(--navy)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[var(--text-muted)]">{message}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="py-16 text-center text-[var(--text-muted)]">{message}</div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mb-6 w-full max-w-md rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
    />
  );
}
