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

export type Shift = {
  shift_id: string;
  client_id: string;
  client_first_name: string;
  client_last_name: string;
  caregiver_id: string | null;
  caregiver_user_id: string | null;
  caregiver_profile_id: string | null;
  caregiver_first_name: string | null;
  caregiver_last_name: string | null;
  scheduled_start_at: string;
  scheduled_end_at: string;
  actual_start_at: string | null;
  actual_end_at: string | null;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
};

export type ShiftInput = {
  client_id: string;
  caregiver_id?: string | null;
  scheduled_start_at: string;
  scheduled_end_at: string;
};

export type ShiftUpdateInput = {
  scheduled_start_at?: string;
  scheduled_end_at?: string;
};
