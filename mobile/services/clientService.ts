import { api } from "./api";
import type { Shift, ShiftActivity, ShiftComment } from "@/types";

export const clientService = {
  listShifts: () => api.get<Shift[]>("/client/shifts"),
  getShift: (id: string) => api.get<Shift>(`/client/shifts/${id}`),
  listActivities: (id: string) =>
    api.get<ShiftActivity[]>(`/client/shifts/${id}/activities`),
  listComments: (id: string) =>
    api.get<ShiftComment[]>(`/client/shifts/${id}/comments`),
  addComment: (id: string, body: string) =>
    api.post<ShiftComment>(`/client/shifts/${id}/comments`, { body }),
};
