import { api } from "./api";
import type {
  CaregiverClient,
  CatalogActivity,
  Shift,
  ShiftActivity,
  ShiftComment,
} from "@/types";

export const caregiverService = {
  listShifts: () => api.get<Shift[]>("/caregiver/shifts"),
  getShift: (id: string) => api.get<Shift>(`/caregiver/shifts/${id}`),
  clockIn: (id: string) => api.post<Shift>(`/caregiver/shifts/${id}/clock-in`, {}),
  clockOut: (id: string) => api.post<Shift>(`/caregiver/shifts/${id}/clock-out`, {}),
  listClients: () => api.get<CaregiverClient[]>("/caregiver/clients"),
  listCatalog: () => api.get<CatalogActivity[]>("/caregiver/activities"),
  listActivities: (id: string) =>
    api.get<ShiftActivity[]>(`/caregiver/shifts/${id}/activities`),
  logActivity: (id: string, activityId: string) =>
    api.post<ShiftActivity>(`/caregiver/shifts/${id}/activities`, {
      activity_id: activityId,
    }),
  deleteActivity: (shiftId: string, activityId: string) =>
    api.delete<void>(`/caregiver/shifts/${shiftId}/activities/${activityId}`),
  listComments: (id: string) =>
    api.get<ShiftComment[]>(`/caregiver/shifts/${id}/comments`),
  addComment: (id: string, body: string) =>
    api.post<ShiftComment>(`/caregiver/shifts/${id}/comments`, { body }),
};
