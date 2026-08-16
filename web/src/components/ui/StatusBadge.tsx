import type { ShiftStatus } from "@/types";

type StatusBadgeProps = {
  label: string;
  tone?: "navy" | "red" | "green" | "gold" | "muted";
  onClick?: () => void;
};

const toneColors: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  navy: "var(--navy)",
  red: "var(--red)",
  green: "var(--success)",
  gold: "var(--gold)",
  muted: "var(--text-muted)",
};

export default function StatusBadge({ label, tone = "navy", onClick }: StatusBadgeProps) {
  const color = toneColors[tone];
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${onClick ? "cursor-pointer border-none" : ""}`}
      style={{
        color,
        backgroundColor: `${color}18`,
      }}
    >
      {label}
    </Tag>
  );
}

export function activityStatusBadge(active: boolean, onToggle?: () => void) {
  return (
    <StatusBadge
      label={active ? "Active" : "Inactive"}
      tone={active ? "green" : "muted"}
      onClick={onToggle}
    />
  );
}

export function shiftStatusTone(status: ShiftStatus): StatusBadgeProps["tone"] {
  switch (status) {
    case "open":
      return "gold";
    case "assigned":
      return "navy";
    case "in_progress":
      return "green";
    case "completed":
      return "muted";
    case "cancelled":
      return "red";
    default:
      return "muted";
  }
}
