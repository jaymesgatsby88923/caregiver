import { api } from "./api";
import type { Shift, ShiftInput, ShiftUpdateInput } from "@/types";

export type ShiftListParams = {
  status?: string;
  client_id?: string;
  caregiver_id?: string;
  start_from?: string;
  start_to?: string;
};

function buildQuery(params?: ShiftListParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.client_id) search.set("client_id", params.client_id);
  if (params.caregiver_id) search.set("caregiver_id", params.caregiver_id);
  if (params.start_from) search.set("start_from", params.start_from);
  if (params.start_to) search.set("start_to", params.start_to);
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const shiftService = {
  list: (params?: ShiftListParams) =>
    api.get<Shift[]>(`/admin/shifts${buildQuery(params)}`),

  get: (id: string) => api.get<Shift>(`/admin/shifts/${id}`),

  create: (data: ShiftInput) => api.post<Shift>("/admin/shifts", data),

  update: (id: string, data: ShiftUpdateInput) =>
    api.patch<Shift>(`/admin/shifts/${id}`, data),

  assign: (id: string, caregiverId: string) =>
    api.post<Shift>(`/admin/shifts/${id}/assign`, { caregiver_id: caregiverId }),

  unassign: (id: string) => api.post<Shift>(`/admin/shifts/${id}/unassign`, {}),

  reassign: (id: string, caregiverId: string) =>
    api.post<Shift>(`/admin/shifts/${id}/reassign`, { caregiver_id: caregiverId }),

  cancel: (id: string) => api.post<Shift>(`/admin/shifts/${id}/cancel`, {}),
};
