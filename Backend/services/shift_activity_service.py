from datetime import datetime, timedelta, timezone

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


def _as_utc(value) -> datetime:
    if isinstance(value, datetime):
        parsed = value
    else:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _logged_at_for_shift(logged_at: datetime | None, shift) -> str | None:
    if logged_at is None:
        return None

    clock_in = shift.get("actual_start_at")
    if not clock_in:
        raise HTTPException(
            status_code=400,
            detail="Shift has no clock-in time",
        )

    event = _as_utc(logged_at)
    start = _as_utc(clock_in)
    now = datetime.now(timezone.utc)

    if event < start:
        raise HTTPException(
            status_code=400,
            detail="Activity time must be after clock-in",
        )
    if event > now + timedelta(seconds=60):
        raise HTTPException(
            status_code=400,
            detail="Activity time cannot be in the future",
        )
    return event.isoformat()


def log_for_caregiver(shift_id: str, body: ShiftActivityCreate, current_user):
    shift = shift_service.get_shift_for_caregiver(shift_id, current_user)
    if shift.get("status") != "in_progress":
        raise HTTPException(
            status_code=400,
            detail="Activities can only be logged while the shift is in progress",
        )

    activity = _get_active_activity(body.activity_id)
    notes = body.notes.strip() if body.notes else None
    payload = {
        "shift_id": shift_id,
        "activity_id": activity["activity_id"],
        "activity_name": activity["name"],
        "notes": notes,
        "logged_by": current_user["user_id"],
    }
    logged_at = _logged_at_for_shift(body.logged_at, shift)
    if logged_at:
        payload["logged_at"] = logged_at

    result = supabase.table(TABLE).insert(payload).execute()
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
