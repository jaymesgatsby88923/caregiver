import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Caregiver, CareTeamAssignment, Client } from "@/types";
import { clientService } from "@/services/clientService";
import { caregiverService } from "@/services/caregiverService";
import { assignmentService } from "@/services/assignmentService";
import PageHeader, {
  EmptyState,
  LoadingState,
  SearchInput,
  SummaryChips,
} from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { activityStatusBadge } from "@/components/ui/StatusBadge";

type ClientFormProps = {
  client: Client | null;
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    billing_rate: number;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
};

function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [firstName, setFirstName] = useState(client?.first_name ?? "");
  const [lastName, setLastName] = useState(client?.last_name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [address, setAddress] = useState(client?.address ?? "");
  const [billingRate, setBillingRate] = useState(String(client?.billing_rate ?? ""));
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFirstName(client?.first_name ?? "");
    setLastName(client?.last_name ?? "");
    setEmail(client?.email ?? "");
    setPhone(client?.phone ?? "");
    setAddress(client?.address ?? "");
    setBillingRate(String(client?.billing_rate ?? ""));
    setNotes(client?.notes ?? "");
  }, [client]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        billing_rate: Number(billingRate) || 0,
        notes: notes.trim(),
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
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Address</label>
        <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Billing Rate ($/hr)</label>
        <input type="number" min={0} value={billingRate} onChange={(e) => setBillingRate(e.target.value)} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Notes</label>
        <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={fieldClass} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Client"}</Button>
      </div>
    </form>
  );
}

type CareTeamModalProps = {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
};

function CareTeamModal({ client, isOpen, onClose }: CareTeamModalProps) {
  const [careTeam, setCareTeam] = useState<CareTeamAssignment[]>([]);
  const [allCaregivers, setAllCaregivers] = useState<Caregiver[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !client) return;
    const clientId = client.client_id;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [team, caregivers] = await Promise.all([
          clientService.getCareTeam(clientId),
          caregiverService.list(),
        ]);
        setCareTeam(Array.isArray(team) ? team : []);
        setAllCaregivers(caregivers.filter((c) => c.active));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load care team.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isOpen, client]);

  const assignedIds = new Set(careTeam.map((a) => a.caregiver_id));

  const available = allCaregivers.filter((c) => {
    if (assignedIds.has(c.caregiver_id)) return false;
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      c.first_name.toLowerCase().includes(query) ||
      c.last_name.toLowerCase().includes(query)
    );
  });

  async function addToTeam(caregiverId: string) {
    if (!client) return;
    setError("");
    try {
      await assignmentService.add(client.client_id, caregiverId);
      const team = await clientService.getCareTeam(client.client_id);
      setCareTeam(Array.isArray(team) ? team : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add caregiver.");
    }
  }

  async function removeFromTeam(assignmentId: string) {
    if (!client) return;
    setError("");
    try {
      await assignmentService.remove(assignmentId);
      const team = await clientService.getCareTeam(client.client_id);
      setCareTeam(Array.isArray(team) ? team : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove caregiver.");
    }
  }

  if (!client) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={`Care Team — ${client.first_name} ${client.last_name}`}
      onClose={onClose}
      wide
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--red)]">{error}</p>
      ) : null}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--navy)]">Current Care Team</h3>
            {careTeam.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No caregivers assigned yet.</p>
            ) : (
              <ul className="space-y-2">
                {careTeam.map((assignment) => (
                  <li
                    key={assignment.assignment_id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3"
                  >
                    <span>
                      {assignment.Caregivers.Users.first_name}{" "}
                      {assignment.Caregivers.Users.last_name}
                    </span>
                    <Button
                      variant="ghost"
                      className="!px-3 !py-1 !text-xs text-[var(--red)]"
                      onClick={() => removeFromTeam(assignment.assignment_id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--navy)]">Add Caregiver</h3>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name..."
            />
            <ul className="max-h-48 space-y-2 overflow-y-auto">
              {available.map((caregiver) => (
                <li
                  key={caregiver.caregiver_id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3"
                >
                  <span>
                    {caregiver.first_name} {caregiver.last_name}
                  </span>
                  <Button
                    variant="ghost"
                    className="!px-3 !py-1 !text-xs"
                    onClick={() => addToTeam(caregiver.caregiver_id)}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCareTeamOpen, setIsCareTeamOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [careTeamClient, setCareTeamClient] = useState<Client | null>(null);

  async function loadClients() {
    setIsLoading(true);
    try {
      setClients(await clientService.list());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (c) =>
        c.first_name.toLowerCase().includes(query) ||
        c.last_name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query),
    );
  }, [clients, search]);

  const counts = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => c.active).length,
      inactive: clients.filter((c) => !c.active).length,
    }),
    [clients],
  );

  async function saveClient(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    billing_rate: number;
    notes: string;
  }) {
    if (selected) {
      await clientService.update(selected.client_id, data);
    } else {
      await clientService.create(data);
    }
    setIsModalOpen(false);
    await loadClients();
  }

  async function toggleStatus(client: Client) {
    await clientService.update(client.client_id, { active: !client.active });
    await loadClients();
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Manage client records and care teams."
        actionLabel="+ Add Client"
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

      <SearchInput value={search} onChange={setSearch} placeholder="Search clients..." />

      {isLoading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No Clients Found"
          message="Add your first client or adjust your search."
          actionLabel="+ Add Client"
          onAction={() => {
            setSelected(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <article
              key={client.client_id}
              className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="m-0 font-semibold text-[var(--navy)]">
                    {client.first_name} {client.last_name}
                  </h3>
                  <p className="mt-1 mb-0 text-sm text-[var(--text-muted)]">{client.email}</p>
                  <p className="mt-1 mb-0 text-sm text-[var(--text-muted)]">{client.phone}</p>
                  {client.billing_rate != null && (
                    <p className="mt-2 mb-0 text-sm font-medium">${client.billing_rate}/hr</p>
                  )}
                </div>
                {activityStatusBadge(client.active, () => toggleStatus(client))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  className="!px-3 !py-1.5 !text-xs"
                  onClick={() => {
                    setSelected(client);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  className="!px-3 !py-1.5 !text-xs"
                  onClick={() => {
                    setCareTeamClient(client);
                    setIsCareTeamOpen(true);
                  }}
                >
                  Care Team
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={selected ? "Edit Client" : "Add Client"}
        onClose={() => setIsModalOpen(false)}
        wide
      >
        <ClientForm
          key={selected?.client_id ?? "new"}
          client={selected}
          onSubmit={saveClient}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <CareTeamModal
        client={careTeamClient}
        isOpen={isCareTeamOpen}
        onClose={() => setIsCareTeamOpen(false)}
      />
    </div>
  );
}
