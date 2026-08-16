export type UserRole = "admin" | "caregiver" | "client";

export type CurrentUser = {
  first_name: string;
  role: UserRole;
};

export type Activity = {
  activity_id: string;
  name: string;
  active: boolean;
};

export type Caregiver = {
  caregiver_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  rate: number;
  active: boolean;
};

export type Client = {
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  billing_rate: number;
  notes: string;
  active: boolean;
};

export type CareTeamAssignment = {
  assignment_id: string;
  caregiver_id: string;
  Caregivers: {
    user_id: string;
    Users: {
      first_name: string;
      last_name: string;
    };
  };
};

export type ShiftStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
