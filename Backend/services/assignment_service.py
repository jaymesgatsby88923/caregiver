from database.supabase import supabase
from models.assignments import AssignmentCreate, AssignmentUpdate


def get_careteam(client_id: str, current_user):
    result = (
        supabase
        .table("Assignments")
        .select("""
            assignment_id,
            caregiver_id,
            Caregivers(
                user_id,
                Users(
                    first_name,
                    last_name
                )
            )
        """)
        .eq("client_id", client_id)
        .eq("active_id", True)
        .execute()
    )
    return result.data


def update_assignment(assignment_id, assignment: AssignmentUpdate, current_user):
    update_data = assignment.model_dump(exclude_unset=True)
    result = (
        supabase
        .table("Assignments")
        .update(update_data)
        .eq("assignment_id", assignment_id)
        .execute()
    )
    return result.data


def add_assignment(assignment: AssignmentCreate, current_user):
    # Re-adding someone who was removed should turn the existing row back on.
    existing = (
        supabase
        .table("Assignments")
        .select("assignment_id, active_id")
        .eq("client_id", assignment.client_id)
        .eq("caregiver_id", assignment.caregiver_id)
        .execute()
    )

    if existing.data:
        row = existing.data[0]
        if row.get("active_id"):
            return existing.data
        result = (
            supabase
            .table("Assignments")
            .update({"active_id": True})
            .eq("assignment_id", row["assignment_id"])
            .execute()
        )
        return result.data

    result = (
        supabase
        .table("Assignments")
        .insert(
            {
                "client_id": assignment.client_id,
                "caregiver_id": assignment.caregiver_id,
                "active_id": True,
            }
        )
        .execute()
    )
    return result.data


def delete_assignment(assignment_id: str):
    # Soft delete: keep the row, hide it from the care team list.
    result = (
        supabase
        .table("Assignments")
        .update({"active_id": False})
        .eq("assignment_id", assignment_id)
        .execute()
    )
    return result.data
