import { api } from "./api";
import type { Activity } from "@/types";

export const activityService = {
  list: () => api.get<Activity[]>("/admin/activities"),

  create: (data: { name: string }) => api.post<Activity[]>("/admin/activities", data),

  update: (id: string, data: Partial<Pick<Activity, "name" | "active">>) =>
    api.patch<Activity[]>(`/admin/activities/${id}`, data),

  remove: (id: string) => api.delete<Activity[]>(`/admin/activities/${id}`),
};
