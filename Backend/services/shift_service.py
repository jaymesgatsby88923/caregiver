from datetime import datetime, timezone

from fastapi import HTTPException

from database.supabase import supabase
from models.shift import ShiftAssign, ShiftCreate, ShiftUpdate

SHIFT_SELECT = """
    *,
    Clients(client_id, first_name, last_name, address),
    Users(user_id, first_name, last_name, Caregivers(caregiver_id))
"""

EDITABLE_STATUSES = {"open", "assigned"}
CANCELLABLE_STATUSES = {"open", "assigned"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _get_shift_or_404(shift_id: str):
    result = (
        supabase.table("Shifts")
        .select(SHIFT_SELECT)
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Shift not found")
    return result.data[0]


def _get_user_id_for_caregiver(caregiver_id: str) -> str:
    result = (
        supabase.table("Caregivers")
        .select("user_id, active")
        .eq("caregiver_id", caregiver_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Caregiver not found")
    caregiver = result.data[0]
    if not caregiver.get("active", True):
        raise HTTPException(status_code=400, detail="Caregiver is inactive")
    return caregiver["user_id"]


def _validate_care_team(client_id: str, caregiver_id: str):
    result = (
        supabase.table("Assignments")
        .select("assignment_id")
        .eq("client_id", client_id)
        .eq("caregiver_id", caregiver_id)
        .eq("active", True)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=400,
            detail="Caregiver is not on this client's care team",
        )


def _first_related(value):
    # PostgREST returns a nested object for many-to-one and a list for one-to-many.
    if isinstance(value, list):
        return value[0] if value else None
    if isinstance(value, dict):
        return value
    return None


def _format_shift(row: dict, include_visit: bool = False) -> dict:
    client = _first_related(row.pop("Clients", None)) or {}
    user = _first_related(row.pop("Users", None)) or {}
    caregiver_profile = _first_related(user.get("Caregivers"))

    formatted = {
        **row,
        "client_first_name": client.get("first_name"),
        "client_last_name": client.get("last_name"),
        "caregiver_user_id": user.get("user_id"),
        "caregiver_profile_id": (
            caregiver_profile.get("caregiver_id") if caregiver_profile else None
        ),
        "caregiver_first_name": user.get("first_name"),
        "caregiver_last_name": user.get("last_name"),
    }
    if include_visit:
        from services import shift_activity_service, shift_comment_service

        formatted["address"] = client.get("address")
        formatted["activities"] = shift_activity_service.list_for_shift(
            formatted["shift_id"]
        )
        formatted["comments"] = shift_comment_service.list_for_shift(
            formatted["shift_id"]
        )
    return formatted


def list_shifts(
    current_user,
    status: str | None = None,
    client_id: str | None = None,
    caregiver_id: str | None = None,
    start_from: str | None = None,
    start_to: str | None = None,
):
    query = supabase.table("Shifts").select(SHIFT_SELECT)

    if status:
        query = query.eq("status", status)
    if client_id:
        query = query.eq("client_id", client_id)
    if caregiver_id:
        user_id = _get_user_id_for_caregiver(caregiver_id)
        query = query.eq("caregiver_id", user_id)
    if start_from:
        query = query.gte("scheduled_start_at", start_from)
    if start_to:
        query = query.lte("scheduled_start_at", start_to)

    result = query.order("scheduled_start_at", desc=True).execute()
    return [_format_shift(dict(row)) for row in result.data]


def get_shift(shift_id: str, current_user):
    return _format_shift(dict(_get_shift_or_404(shift_id)))


def create_shift(shift: ShiftCreate, current_user):
    payload = {
        "client_id": shift.client_id,
        "scheduled_start_at": shift.scheduled_start_at.isoformat(),
        "scheduled_end_at": shift.scheduled_end_at.isoformat(),
        "status": "open",
        "caregiver_id": None,
    }

    if shift.caregiver_id:
        _validate_care_team(shift.client_id, shift.caregiver_id)
        payload["caregiver_id"] = _get_user_id_for_caregiver(shift.caregiver_id)
        payload["status"] = "assigned"

    result = supabase.table("Shifts").insert(payload).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create shift")
    return get_shift(result.data[0]["shift_id"], current_user)


def update_shift(shift_id: str, shift: ShiftUpdate, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] not in EDITABLE_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Only open or assigned shifts can be edited",
        )

    update_data = shift.model_dump(exclude_unset=True)
    if not update_data:
        return _format_shift(dict(row))

    for key in ("scheduled_start_at", "scheduled_end_at"):
        if key in update_data and update_data[key] is not None:
            update_data[key] = update_data[key].isoformat()

    start = update_data.get("scheduled_start_at", row["scheduled_start_at"])
    end = update_data.get("scheduled_end_at", row["scheduled_end_at"])
    if end <= start:
        raise HTTPException(
            status_code=400,
            detail="scheduled_end_at must be after scheduled_start_at",
        )

    update_data["updated_at"] = _now_iso()
    result = (
        supabase.table("Shifts")
        .update(update_data)
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update shift")
    return get_shift(shift_id, current_user)


def assign_shift(shift_id: str, body: ShiftAssign, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] != "open":
        raise HTTPException(status_code=400, detail="Only open shifts can be assigned")

    _validate_care_team(row["client_id"], body.caregiver_id)
    user_id = _get_user_id_for_caregiver(body.caregiver_id)

    result = (
        supabase.table("Shifts")
        .update(
            {
                "caregiver_id": user_id,
                "status": "assigned",
                "updated_at": _now_iso(),
            }
        )
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to assign shift")
    return get_shift(shift_id, current_user)


def unassign_shift(shift_id: str, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] != "assigned":
        raise HTTPException(
            status_code=400,
            detail="Only assigned shifts can be unassigned",
        )

    result = (
        supabase.table("Shifts")
        .update(
            {
                "caregiver_id": None,
                "status": "open",
                "updated_at": _now_iso(),
            }
        )
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to unassign shift")
    return get_shift(shift_id, current_user)


def reassign_shift(shift_id: str, body: ShiftAssign, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] != "assigned":
        raise HTTPException(
            status_code=400,
            detail="Only assigned shifts can be reassigned",
        )

    _validate_care_team(row["client_id"], body.caregiver_id)
    user_id = _get_user_id_for_caregiver(body.caregiver_id)

    result = (
        supabase.table("Shifts")
        .update(
            {
                "caregiver_id": user_id,
                "updated_at": _now_iso(),
            }
        )
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to reassign shift")
    return get_shift(shift_id, current_user)


def cancel_shift(shift_id: str, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] not in CANCELLABLE_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Only open or assigned shifts can be cancelled",
        )

    result = (
        supabase.table("Shifts")
        .update({"status": "cancelled", "updated_at": _now_iso()})
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to cancel shift")
    return get_shift(shift_id, current_user)


def clock_in(shift_id: str, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] != "assigned":
        raise HTTPException(
            status_code=400,
            detail="Only assigned shifts can be clocked in",
        )
    if row.get("caregiver_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this shift",
        )

    now = _now_iso()
    result = (
        supabase.table("Shifts")
        .update(
            {
                "actual_start_at": now,
                "status": "in_progress",
                "updated_at": now,
            }
        )
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to clock in")
    return get_shift(shift_id, current_user)


def clock_out(shift_id: str, current_user):
    row = _get_shift_or_404(shift_id)
    if row["status"] != "in_progress":
        raise HTTPException(
            status_code=400,
            detail="Only in-progress shifts can be clocked out",
        )
    if row.get("caregiver_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this shift",
        )

    now = _now_iso()
    result = (
        supabase.table("Shifts")
        .update(
            {
                "actual_end_at": now,
                "status": "completed",
                "updated_at": now,
            }
        )
        .eq("shift_id", shift_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to clock out")
    return get_shift(shift_id, current_user)


def _get_client_id_for_user(current_user):
    email = current_user.get("email")
    if not email:
        raise HTTPException(status_code=404, detail="Client profile not found")

    result = (
        supabase.table("Clients")
        .select("client_id")
        .eq("email", email)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Client profile not found")
    return result.data[0]["client_id"]


def list_shifts_for_caregiver(
    current_user,
    status: str | None = None,
    start_from: str | None = None,
    start_to: str | None = None,
):
    query = (
        supabase.table("Shifts")
        .select(SHIFT_SELECT)
        .eq("caregiver_id", current_user["user_id"])
    )

    if status:
        query = query.eq("status", status)
    if start_from:
        query = query.gte("scheduled_start_at", start_from)
    if start_to:
        query = query.lte("scheduled_start_at", start_to)

    result = query.order("scheduled_start_at", desc=True).execute()
    return [_format_shift(dict(row)) for row in result.data]


def get_shift_for_caregiver(shift_id: str, current_user, include_visit: bool = False):
    row = _get_shift_or_404(shift_id)
    if row.get("caregiver_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this shift",
        )
    return _format_shift(dict(row), include_visit=include_visit)


def list_shifts_for_client(
    current_user,
    status: str | None = None,
    start_from: str | None = None,
    start_to: str | None = None,
):
    client_id = _get_client_id_for_user(current_user)
    return list_shifts(
        current_user,
        status=status,
        client_id=client_id,
        start_from=start_from,
        start_to=start_to,
    )


def get_shift_for_client(shift_id: str, current_user, include_visit: bool = False):
    client_id = _get_client_id_for_user(current_user)
    row = _get_shift_or_404(shift_id)
    if row["client_id"] != client_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this shift",
        )
    return _format_shift(dict(row), include_visit=include_visit)
