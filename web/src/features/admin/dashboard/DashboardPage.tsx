import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/services/clientService";
import { caregiverService } from "@/services/caregiverService";
import { shiftService } from "@/services/shiftService";
import { SummaryChips } from "@/components/ui/PageHeader";

const quickLinks = [
  { to: "/admin/clients", title: "Clients", desc: "Manage client records and care teams." },
  { to: "/admin/caregivers", title: "Caregivers", desc: "Manage caregiver accounts." },
  { to: "/admin/activities", title: "Activities", desc: "Manage care activity catalog." },
  { to: "/admin/shifts", title: "Shifts", desc: "Schedule and assign visits." },
  { to: "/admin/users", title: "Users", desc: "Create admin, caregiver, and client accounts." },
  { to: "/admin/settings", title: "Settings", desc: "Agency configuration." },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    caregivers: 0,
    activeShifts: 0,
    openShifts: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [clients, caregivers, inProgress, open] = await Promise.all([
          clientService.list(),
          caregiverService.list(),
          shiftService.list({ status: "in_progress" }),
          shiftService.list({ status: "open" }),
        ]);
        setStats({
          clients: clients.length,
          caregivers: caregivers.length,
          activeShifts: inProgress.length,
          openShifts: open.length,
        });
      } catch {
        // Dashboard can render with zeros if API unavailable
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="serif m-0 text-3xl font-bold text-[var(--navy)]">
        Dashboard
      </h1>
      <p className="mt-2 text-[var(--text-muted)]">
        Here's what's happening across your care network today, {user?.first_name}.
      </p>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--navy)]">
          Today's Overview
        </h2>
        <SummaryChips
          items={[
            { label: "Active Shifts", value: stats.activeShifts },
            { label: "Open Shifts", value: stats.openShifts, tone: "inactive" },
            { label: "Total Clients", value: stats.clients },
            { label: "Total Caregivers", value: stats.caregivers },
          ]}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--navy)]">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <article
              key={link.to}
              className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm"
            >
              <h3 className="serif m-0 text-lg font-bold text-[var(--navy)]">
                {link.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{link.desc}</p>
              <Link
                to={link.to}
                className="mt-4 inline-block text-sm font-semibold text-[var(--red)] no-underline hover:underline"
              >
                Manage →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
