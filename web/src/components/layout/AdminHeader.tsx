import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-8 py-4">
      <div>
        <p className="m-0 text-sm text-[var(--text-muted)]">Welcome back</p>
        <p className="m-0 font-semibold text-[var(--navy)]">
          {user?.first_name ?? "Admin"}
        </p>
      </div>
      <Button variant="ghost" className="!px-4 !py-2" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
