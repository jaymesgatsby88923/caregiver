import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function PortalShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
        <Logo compact />
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-muted)]">
            {user?.first_name}
          </span>
          <Button variant="ghost" className="!px-4 !py-2" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-6">{children}</main>
    </div>
  );
}
