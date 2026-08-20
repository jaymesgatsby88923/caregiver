import { api } from "./api";
import type { Caregiver } from "@/types";

export type CaregiverInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  rate: number;
};

export const caregiverService = {
  list: () => api.get<Caregiver[]>("/admin/caregivers"),

  create: (data: CaregiverInput) => api.post<Caregiver[]>("/admin/caregivers", data),

  update: (
    id: string,
    data: Partial<CaregiverInput & { active: boolean; user_id: string }>,
  ) => api.patch<Caregiver[]>(`/admin/caregivers/${id}`, data),

  remove: (id: string) => api.delete<Caregiver[]>(`/admin/caregivers/${id}`),
};
