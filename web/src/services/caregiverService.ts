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
  list: () => api.get<Caregiver[]>("/caregivers"),

  create: (data: CaregiverInput) => api.post<Caregiver[]>("/caregivers", data),

  update: (
    id: string,
    data: Partial<CaregiverInput & { active: boolean; user_id: string }>,
  ) => api.patch<Caregiver[]>(`/caregivers/${id}`, data),

  remove: (id: string) => api.delete<Caregiver[]>(`/caregivers/${id}`),
};
