import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Activity } from "@/types";
import { activityService } from "@/services/activityService";
import PageHeader, {
  EmptyState,
  LoadingState,
  SearchInput,
  SummaryChips,
} from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { activityStatusBadge } from "@/components/ui/StatusBadge";

type ActivityFormProps = {
  activity: Activity | null;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
};

function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [name, setName] = useState(activity?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(activity?.name ?? "");
  }, [activity]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(name.trim());
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="activity-name" className="mb-1.5 block text-sm font-medium">
          Activity Name
        </label>
        <input
          id="activity-name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Activity"}
        </Button>
      </div>
    </form>
  );
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Activity | null>(null);

  async function loadActivities() {
    setIsLoading(true);
    try {
      const data = await activityService.list();
      setActivities(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return activities;
    return activities.filter((a) => a.name.toLowerCase().includes(query));
  }, [activities, search]);

  const counts = useMemo(
    () => ({
      total: activities.length,
      active: activities.filter((a) => a.active).length,
      inactive: activities.filter((a) => !a.active).length,
    }),
    [activities],
  );

  function openAdd() {
    setSelected(null);
    setIsModalOpen(true);
  }

  function openEdit(activity: Activity) {
    setSelected(activity);
    setIsModalOpen(true);
  }

  async function saveActivity(name: string) {
    if (selected) {
      await activityService.update(selected.activity_id, { name });
    } else {
      await activityService.create({ name });
    }
    setIsModalOpen(false);
    await loadActivities();
  }

  async function toggleStatus(activity: Activity) {
    await activityService.update(activity.activity_id, { active: !activity.active });
    await loadActivities();
  }

  return (
    <div>
      <PageHeader
        title="Activities"
        subtitle="Manage activities caregivers can perform during client shifts."
        actionLabel="+ Add Activity"
        onAction={openAdd}
      />

      <SummaryChips
        items={[
          { label: "Total", value: counts.total },
          { label: "Active", value: counts.active, tone: "active" },
          { label: "Inactive", value: counts.inactive, tone: "inactive" },
        ]}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search activities..."
      />

      {isLoading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Activities Found"
          message="Add your first activity or adjust your search."
          actionLabel="+ Add Activity"
          onAction={openAdd}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[var(--border)] bg-[var(--soft-blue)] px-5 py-3 text-sm font-semibold text-[var(--navy)]">
            <div>Activity Name</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {filtered.map((activity) => (
            <div
              key={activity.activity_id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
            >
              <div className="font-medium">{activity.name}</div>
              <div>{activityStatusBadge(activity.active, () => toggleStatus(activity))}</div>
              <Button
                variant="ghost"
                className="!px-3 !py-1.5 !text-xs"
                onClick={() => openEdit(activity)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={selected ? "Edit Activity" : "Add Activity"}
        onClose={() => setIsModalOpen(false)}
      >
        <ActivityForm
          key={selected?.activity_id ?? "new"}
          activity={selected}
          onSubmit={saveActivity}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
