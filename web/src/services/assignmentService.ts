import { api } from "./api";

export const assignmentService = {
  add: (clientId: string, caregiverId: string) =>
    api.post("/assignments", {
      client_id: clientId,
      caregiver_id: caregiverId,
    }),

  remove: (assignmentId: string) =>
    api.delete(`/assignments/${assignmentId}`),
};
