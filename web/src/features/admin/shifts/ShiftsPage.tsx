import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { CareTeamAssignment, Client, Shift, ShiftStatus } from "@/types";
import { shiftService } from "@/services/shiftService";
import { clientService } from "@/services/clientService";
import { caregiverService } from "@/services/caregiverService";
import PageHeader, {
  EmptyState,
  LoadingState,
  SearchInput,
  SummaryChips,
} from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StatusBadge, { shiftStatusTone } from "@/components/ui/StatusBadge";

const STATUS_OPTIONS: { value: ShiftStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function formatStatus(status: ShiftStatus): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}

type ShiftFormProps = {
  shift: Shift | null;
  clients: Client[];
  onSubmit: (data: {
    client_id: string;
    caregiver_id?: string | null;
    scheduled_start_at: string;
    scheduled_end_at: string;
  }) => Promise<void>;
  onCancel: () => void;
};

function ShiftForm({ shift, clients, onSubmit, onCancel }: ShiftFormProps) {
  const isEdit = Boolean(shift);
  const [clientId, setClientId] = useState(shift?.client_id ?? "");
  const [careTeam, setCareTeam] = useState<CareTeamAssignment[]>([]);
  const [caregiverId, setCaregiverId] = useState(shift?.caregiver_profile_id ?? "");
  const [startAt, setStartAt] = useState(toLocalInputValue(shift?.scheduled_start_at ?? null));
  const [endAt, setEndAt] = useState(toLocalInputValue(shift?.scheduled_end_at ?? null));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setClientId(shift?.client_id ?? "");
    setCaregiverId(shift?.caregiver_profile_id ?? "");
    setStartAt(toLocalInputValue(shift?.scheduled_start_at ?? null));
    setEndAt(toLocalInputValue(shift?.scheduled_end_at ?? null));
  }, [shift]);

  useEffect(() => {
    if (!clientId || isEdit) {
      setCareTeam([]);
      return;
    }
    clientService.getCareTeam(clientId).then(setCareTeam).catch(() => setCareTeam([]));
  }, [clientId, isEdit]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit({
        client_id: clientId,
        caregiver_id: caregiverId || null,
        scheduled_start_at: fromLocalInputValue(startAt),
        scheduled_end_at: fromLocalInputValue(endAt),
      });
    } finally {
      setIsSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEdit && (
        <div>
          <label className="mb-1.5 block text-sm font-medium">Client</label>
          <select
            required
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setCaregiverId("");
            }}
            className={fieldClass}
          >
            <option value="">Select client...</option>
            {clients.filter((c) => c.active).map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.first_name} {client.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isEdit && clientId && (
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Caregiver (optional — leave blank for open shift)
          </label>
          <select
            value={caregiverId}
            onChange={(e) => setCaregiverId(e.target.value)}
            className={fieldClass}
          >
            <option value="">Open shift</option>
            {careTeam.map((assignment) => (
              <option key={assignment.caregiver_id} value={assignment.caregiver_id}>
                {assignment.Caregivers.Users.first_name}{" "}
                {assignment.Caregivers.Users.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Scheduled start</label>
          <input
            required
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Scheduled end</label>
          <input
            required
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Shift"}
        </Button>
      </div>
    </form>
  );
}

type AssignModalProps = {
  shift: Shift | null;
  isOpen: boolean;
  mode: "assign" | "reassign";
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function AssignModal({ shift, isOpen, mode, onClose, onSaved }: AssignModalProps) {
  const [careTeam, setCareTeam] = useState<CareTeamAssignment[]>([]);
  const [caregiverId, setCaregiverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !shift) return;
    setCaregiverId("");
    setIsLoading(true);
    clientService
      .getCareTeam(shift.client_id)
      .then(setCareTeam)
      .finally(() => setIsLoading(false));
  }, [isOpen, shift]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!shift || !caregiverId) return;
    setIsSaving(true);
    try {
      if (mode === "assign") {
        await shiftService.assign(shift.shift_id, caregiverId);
      } else {
        await shiftService.reassign(shift.shift_id, caregiverId);
      }
      onClose();
      await onSaved();
    } finally {
      setIsSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]";

  return (
    <Modal
      isOpen={isOpen}
      title={mode === "assign" ? "Assign Caregiver" : "Reassign Caregiver"}
      onClose={onClose}
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Only caregivers on {shift?.client_first_name} {shift?.client_last_name}&apos;s care
            team can be assigned.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Caregiver</label>
            <select
              required
              value={caregiverId}
              onChange={(e) => setCaregiverId(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select caregiver...</option>
              {careTeam.map((assignment) => (
                <option key={assignment.caregiver_id} value={assignment.caregiver_id}>
                  {assignment.Caregivers.Users.first_name}{" "}
                  {assignment.Caregivers.Users.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "assign" ? "Assign" : "Reassign"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

type DetailModalProps = {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
};

function DetailModal({ shift, isOpen, onClose }: DetailModalProps) {
  if (!shift) return null;

  return (
    <Modal isOpen={isOpen} title="Shift Detail" onClose={onClose} wide>
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <StatusBadge label={formatStatus(shift.status)} tone={shiftStatusTone(shift.status)} />
          <span className="text-[var(--text-muted)]">
            {shift.client_first_name} {shift.client_last_name}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--navy)]">Scheduled</h3>
            <p className="m-0">{formatDateTime(shift.scheduled_start_at)}</p>
            <p className="m-0 text-[var(--text-muted)]">to {formatDateTime(shift.scheduled_end_at)}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--navy)]">Actual</h3>
            <p className="m-0">Start: {formatDateTime(shift.actual_start_at)}</p>
            <p className="m-0">End: {formatDateTime(shift.actual_end_at)}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-1 font-semibold text-[var(--navy)]">Caregiver</h3>
          <p className="m-0">
            {shift.caregiver_first_name
              ? `${shift.caregiver_first_name} ${shift.caregiver_last_name}`
              : "Unassigned (open shift)"}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShiftStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState<Shift | null>(null);
  const [detailShift, setDetailShift] = useState<Shift | null>(null);
  const [assignShift, setAssignShift] = useState<Shift | null>(null);
  const [assignMode, setAssignMode] = useState<"assign" | "reassign">("assign");

  async function loadShifts() {
    setIsLoading(true);
    try {
      const params: Parameters<typeof shiftService.list>[0] = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (clientFilter) params.client_id = clientFilter;
      setShifts(await shiftService.list(params));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadShifts();
  }, [statusFilter, clientFilter]);

  useEffect(() => {
    clientService.list().then(setClients).catch(() => setClients([]));
    caregiverService.list().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return shifts;
    return shifts.filter((shift) => {
      const clientName = `${shift.client_first_name} ${shift.client_last_name}`.toLowerCase();
      const caregiverName = shift.caregiver_first_name
        ? `${shift.caregiver_first_name} ${shift.caregiver_last_name}`.toLowerCase()
        : "";
      return clientName.includes(query) || caregiverName.includes(query);
    });
  }, [shifts, search]);

  const counts = useMemo(
    () => ({
      total: shifts.length,
      open: shifts.filter((s) => s.status === "open").length,
      assigned: shifts.filter((s) => s.status === "assigned").length,
      inProgress: shifts.filter((s) => s.status === "in_progress").length,
    }),
    [shifts],
  );

  function openCreate() {
    setSelected(null);
    setIsFormOpen(true);
  }

  function openEdit(shift: Shift) {
    setSelected(shift);
    setIsFormOpen(true);
  }

  async function saveShift(data: {
    client_id: string;
    caregiver_id?: string | null;
    scheduled_start_at: string;
    scheduled_end_at: string;
  }) {
    if (selected) {
      await shiftService.update(selected.shift_id, {
        scheduled_start_at: data.scheduled_start_at,
        scheduled_end_at: data.scheduled_end_at,
      });
    } else {
      await shiftService.create({
        client_id: data.client_id,
        caregiver_id: data.caregiver_id || undefined,
        scheduled_start_at: data.scheduled_start_at,
        scheduled_end_at: data.scheduled_end_at,
      });
    }
    setIsFormOpen(false);
    await loadShifts();
  }

  async function handleUnassign(shift: Shift) {
    if (!window.confirm("Remove the caregiver and mark this shift as open?")) return;
    await shiftService.unassign(shift.shift_id);
    await loadShifts();
  }

  async function handleCancel(shift: Shift) {
    if (!window.confirm("Cancel this shift? This cannot be undone.")) return;
    await shiftService.cancel(shift.shift_id);
    await loadShifts();
  }

  function openAssign(shift: Shift, mode: "assign" | "reassign") {
    setAssignShift(shift);
    setAssignMode(mode);
  }

  const filterClass =
    "rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]";

  return (
    <div>
      <PageHeader
        title="Shifts"
        subtitle="Schedule visits, assign caregivers, and manage open shifts."
        actionLabel="+ Create Shift"
        onAction={openCreate}
      />

      <SummaryChips
        items={[
          { label: "Total", value: counts.total },
          { label: "Open", value: counts.open, tone: "inactive" },
          { label: "Assigned", value: counts.assigned },
          { label: "In Progress", value: counts.inProgress, tone: "active" },
        ]}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by client or caregiver..."
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ShiftStatus | "all")}
          className={filterClass}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className={filterClass}
        >
          <option value="">All clients</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.first_name} {client.last_name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No Shifts Found"
          message="Create a shift or adjust your filters."
          actionLabel="+ Create Shift"
          onAction={openCreate}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <div className="grid grid-cols-[1.2fr_1fr_1.2fr_auto_auto] gap-4 border-b border-[var(--border)] bg-[var(--soft-blue)] px-5 py-3 text-sm font-semibold text-[var(--navy)] max-lg:hidden">
            <div>Client</div>
            <div>Caregiver</div>
            <div>Scheduled</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {filtered.map((shift) => (
            <div
              key={shift.shift_id}
              className="border-b border-[var(--border)] px-5 py-4 last:border-b-0"
            >
              <div className="grid items-center gap-4 max-lg:space-y-3 lg:grid-cols-[1.2fr_1fr_1.2fr_auto_auto]">
                <div>
                  <div className="font-medium text-[var(--navy)]">
                    {shift.client_first_name} {shift.client_last_name}
                  </div>
                </div>
                <div className="text-sm">
                  {shift.caregiver_first_name
                    ? `${shift.caregiver_first_name} ${shift.caregiver_last_name}`
                    : "—"}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {formatDateTime(shift.scheduled_start_at)}
                  <br />
                  to {formatDateTime(shift.scheduled_end_at)}
                </div>
                <div>
                  <StatusBadge
                    label={formatStatus(shift.status)}
                    tone={shiftStatusTone(shift.status)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    className="!px-3 !py-1.5 !text-xs"
                    onClick={() => setDetailShift(shift)}
                  >
                    View
                  </Button>
                  {(shift.status === "open" || shift.status === "assigned") && (
                    <Button
                      variant="ghost"
                      className="!px-3 !py-1.5 !text-xs"
                      onClick={() => openEdit(shift)}
                    >
                      Edit
                    </Button>
                  )}
                  {shift.status === "open" && (
                    <Button
                      variant="secondary"
                      className="!px-3 !py-1.5 !text-xs"
                      onClick={() => openAssign(shift, "assign")}
                    >
                      Assign
                    </Button>
                  )}
                  {shift.status === "assigned" && (
                    <>
                      <Button
                        variant="secondary"
                        className="!px-3 !py-1.5 !text-xs"
                        onClick={() => openAssign(shift, "reassign")}
                      >
                        Reassign
                      </Button>
                      <Button
                        variant="ghost"
                        className="!px-3 !py-1.5 !text-xs"
                        onClick={() => handleUnassign(shift)}
                      >
                        Unassign
                      </Button>
                    </>
                  )}
                  {(shift.status === "open" || shift.status === "assigned") && (
                    <Button
                      variant="ghost"
                      className="!px-3 !py-1.5 !text-xs text-[var(--red)]"
                      onClick={() => handleCancel(shift)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        title={selected ? "Edit Shift" : "Create Shift"}
        onClose={() => setIsFormOpen(false)}
        wide
      >
        <ShiftForm
          key={selected?.shift_id ?? "new"}
          shift={selected}
          clients={clients}
          onSubmit={saveShift}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <DetailModal
        shift={detailShift}
        isOpen={Boolean(detailShift)}
        onClose={() => setDetailShift(null)}
      />

      <AssignModal
        shift={assignShift}
        isOpen={Boolean(assignShift)}
        mode={assignMode}
        onClose={() => setAssignShift(null)}
        onSaved={loadShifts}
      />
    </div>
  );
}
