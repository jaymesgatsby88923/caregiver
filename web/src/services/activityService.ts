import { api } from "./api";
import type { Activity } from "@/types";

export const activityService = {
  list: () => api.get<Activity[]>("/activities"),

  create: (data: { name: string }) => api.post<Activity[]>("/activities", data),

  update: (id: string, data: Partial<Pick<Activity, "name" | "active">>) =>
    api.patch<Activity[]>(`/activities/${id}`, data),

  remove: (id: string) => api.delete<Activity[]>(`/activities/${id}`),
};
