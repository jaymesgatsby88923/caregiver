import { NavLink } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/activities", label: "Activities" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/caregivers", label: "Caregivers" },
  { to: "/admin/shifts", label: "Shifts" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--navy)] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Logo dark compact />
        <p className="mt-2 text-xs text-white/60">Admin Portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/50">
        CareApp Admin v1.0
      </div>
    </aside>
  );
}
