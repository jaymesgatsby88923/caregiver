from fastapi import HTTPException

from database.supabase import supabase
from models.shift_activity import ShiftActivityCreate
from services import shift_service

TABLE = "Shift_Activities"


def get_active_catalog(current_user):
    result = (
        supabase.table("Activities")
        .select("activity_id, name")
        .eq("active", True)
        .order("name")
        .execute()
    )
    return result.data


def list_for_shift(shift_id: str):
    result = (
        supabase.table(TABLE)
        .select(
            "shift_activity_id, shift_id, activity_id, activity_name, notes, logged_at, logged_by"
        )
        .eq("shift_id", shift_id)
        .order("logged_at")
        .execute()
    )
    return result.data


def list_for_caregiver(shift_id: str, current_user):
    shift_service.get_shift_for_caregiver(shift_id, current_user)
    return list_for_shift(shift_id)


def list_for_client(shift_id: str, current_user):
    shift_service.get_shift_for_client(shift_id, current_user)
    return list_for_shift(shift_id)


def list_for_admin(shift_id: str, current_user):
    shift_service.get_shift(shift_id, current_user)
    return list_for_shift(shift_id)


def _get_active_activity(activity_id: str):
    result = (
        supabase.table("Activities")
        .select("activity_id, name, active")
        .eq("activity_id", activity_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Activity not found")
    activity = result.data[0]
    if not activity.get("active", True):
        raise HTTPException(status_code=400, detail="Activity is inactive")
    return activity


def log_for_caregiver(shift_id: str, body: ShiftActivityCreate, current_user):
    shift = shift_service.get_shift_for_caregiver(shift_id, current_user)
    if shift.get("status") != "in_progress":
        raise HTTPException(
            status_code=400,
            detail="Activities can only be logged while the shift is in progress",
        )

    activity = _get_active_activity(body.activity_id)
    notes = body.notes.strip() if body.notes else None

    result = (
        supabase.table(TABLE)
        .insert(
            {
                "shift_id": shift_id,
                "activity_id": activity["activity_id"],
                "activity_name": activity["name"],
                "notes": notes,
                "logged_by": current_user["user_id"],
            }
        )
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to log activity")
    return result.data[0]


def delete_for_caregiver(shift_id: str, shift_activity_id: str, current_user):
    shift = shift_service.get_shift_for_caregiver(shift_id, current_user)
    if shift.get("status") != "in_progress":
        raise HTTPException(
            status_code=400,
            detail="Logged activities can only be removed while the shift is in progress",
        )

    result = (
        supabase.table(TABLE)
        .select("shift_activity_id, shift_id, logged_by")
        .eq("shift_activity_id", shift_activity_id)
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Logged activity not found")

    row = result.data[0]
    if row.get("logged_by") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only remove activities you logged",
        )

    supabase.table(TABLE).delete().eq("shift_activity_id", shift_activity_id).execute()
    return {"ok": True}
