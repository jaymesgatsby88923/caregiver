export type UserRole = "admin" | "caregiver" | "client";

export type CurrentUser = {
  first_name: string;
  role: UserRole;
};

export type ShiftStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ShiftActivity = {
  shift_activity_id: string;
  shift_id: string;
  activity_id: string;
  activity_name: string;
  notes: string | null;
  logged_at: string;
  logged_by: string;
};

export type ShiftComment = {
  shift_comment_id: string;
  shift_id: string;
  author_user_id: string;
  author_first_name: string;
  author_role: UserRole | null;
  body: string;
  created_at: string;
};

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
  address?: string | null;
  activities?: ShiftActivity[];
  comments?: ShiftComment[];
};

export type CaregiverClient = {
  client_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export type CatalogActivity = {
  activity_id: string;
  name: string;
};
