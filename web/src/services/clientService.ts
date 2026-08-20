import { api } from "./api";
import type { CareTeamAssignment, Client } from "@/types";

export type ClientInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  billing_rate: number;
  notes: string;
};

export const clientService = {
  list: () => api.get<Client[]>("/admin/clients"),

  create: (data: ClientInput) => api.post<Client[]>("/admin/clients", data),

  update: (id: string, data: Partial<ClientInput & { active: boolean }>) =>
    api.patch<Client[]>(`/admin/clients/${id}`, data),

  remove: (id: string) => api.delete<Client[]>(`/admin/clients/${id}`),

  getCareTeam: (clientId: string) =>
    api.get<CareTeamAssignment[]>(`/admin/careteam/${clientId}`),
};
