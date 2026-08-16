import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Caregiver } from "@/types";
import { caregiverService } from "@/services/caregiverService";
import PageHeader, {
  EmptyState,
  LoadingState,
  SearchInput,
  SummaryChips,
} from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { activityStatusBadge } from "@/components/ui/StatusBadge";

type CaregiverFormProps = {
  caregiver: Caregiver | null;
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    rate: number;
  }) => Promise<void>;
  onCancel: () => void;
};

function CaregiverForm({ caregiver, onSubmit, onCancel }: CaregiverFormProps) {
  const [firstName, setFirstName] = useState(caregiver?.first_name ?? "");
  const [lastName, setLastName] = useState(caregiver?.last_name ?? "");
  const [email, setEmail] = useState(caregiver?.email ?? "");
  const [phone, setPhone] = useState(caregiver?.phone ?? "");
  const [rate, setRate] = useState(String(caregiver?.rate ?? ""));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFirstName(caregiver?.first_name ?? "");
    setLastName(caregiver?.last_name ?? "");
    setEmail(caregiver?.email ?? "");
    setPhone(caregiver?.phone ?? "");
    setRate(String(caregiver?.rate ?? ""));
  }, [caregiver]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        rate: Number(rate) || 0,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">First Name</label>
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Last Name</label>
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Hourly Rate ($)</label>
        <input required type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Caregiver"}</Button>
      </div>
    </form>
  );
}

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Caregiver | null>(null);

  async function loadCaregivers() {
    setIsLoading(true);
    try {
      setCaregivers(await caregiverService.list());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCaregivers();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return caregivers;
    return caregivers.filter(
      (c) =>
        c.first_name.toLowerCase().includes(query) ||
        c.last_name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query),
    );
  }, [caregivers, search]);

  const counts = useMemo(
    () => ({
      total: caregivers.length,
      active: caregivers.filter((c) => c.active).length,
      inactive: caregivers.filter((c) => !c.active).length,
    }),
    [caregivers],
  );

  async function saveCaregiver(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    rate: number;
  }) {
    if (selected) {
      await caregiverService.update(selected.caregiver_id, {
        ...data,
        user_id: selected.user_id,
      });
    } else {
      await caregiverService.create(data);
    }
    setIsModalOpen(false);
    await loadCaregivers();
  }

  async function toggleStatus(caregiver: Caregiver) {
    await caregiverService.update(caregiver.caregiver_id, {
      user_id: caregiver.user_id,
      active: !caregiver.active,
    });
    await loadCaregivers();
  }

  return (
    <div>
      <PageHeader
        title="Caregivers"
        subtitle="Manage caregivers within your agency."
        actionLabel="+ Add Caregiver"
        onAction={() => {
          setSelected(null);
          setIsModalOpen(true);
        }}
      />

      <SummaryChips
        items={[
          { label: "Total", value: counts.total },
          { label: "Active", value: counts.active, tone: "active" },
          { label: "Inactive", value: counts.inactive, tone: "inactive" },
        ]}
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search caregivers..." />

      {isLoading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No Caregivers Found"
          message="Add your first caregiver to begin."
          actionLabel="+ Add Caregiver"
          onAction={() => {
            setSelected(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((caregiver) => (
            <article
              key={caregiver.caregiver_id}
              className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="m-0 font-semibold text-[var(--navy)]">
                    {caregiver.first_name} {caregiver.last_name}
                  </h3>
                  <p className="mt-1 mb-0 text-sm text-[var(--text-muted)]">{caregiver.email}</p>
                  <p className="mt-1 mb-0 text-sm text-[var(--text-muted)]">{caregiver.phone}</p>
                  <p className="mt-2 mb-0 text-sm font-medium">${caregiver.rate}/hr</p>
                </div>
                {activityStatusBadge(caregiver.active, () => toggleStatus(caregiver))}
              </div>
              <Button
                variant="ghost"
                className="mt-4 !px-3 !py-1.5 !text-xs"
                onClick={() => {
                  setSelected(caregiver);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </Button>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={selected ? "Edit Caregiver" : "Add Caregiver"}
        onClose={() => setIsModalOpen(false)}
      >
        <CaregiverForm
          key={selected?.caregiver_id ?? "new"}
          caregiver={selected}
          onSubmit={saveCaregiver}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
