import { api } from "./api";

// Add/remove care-team rows. Remove is a soft delete (active = false) on the backend.
export const assignmentService = {
  add: (clientId: string, caregiverId: string) =>
    api.post("/assignments", {
      client_id: clientId,
      caregiver_id: caregiverId,
    }),

  remove: (assignmentId: string) =>
    api.delete(`/assignments/${assignmentId}`),
};
