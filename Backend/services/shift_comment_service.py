from fastapi import HTTPException

from database.supabase import supabase
from models.shift_comment import ShiftCommentCreate
from services import shift_service

TABLE = "Shift_Comments"

CLIENT_STATUSES = {"open", "assigned", "in_progress", "completed"}
CAREGIVER_STATUSES = {"in_progress", "completed"}
ADMIN_BLOCKED_STATUSES = {"cancelled"}


def _related(value):
    if isinstance(value, list):
        return value[0] if value else None
    if isinstance(value, dict):
        return value
    return None


def _format_comment(row: dict) -> dict:
    user = _related(row.pop("Users", None)) or {}
    return {
        "shift_comment_id": row.get("shift_comment_id"),
        "shift_id": row.get("shift_id"),
        "author_user_id": row.get("author_user_id"),
        "author_first_name": row.get("author_first_name"),
        "author_role": user.get("role"),
        "body": row.get("body"),
        "created_at": row.get("created_at"),
    }


def list_for_shift(shift_id: str):
    result = (
        supabase.table(TABLE)
        .select(
            """
            shift_comment_id,
            shift_id,
            author_user_id,
            author_first_name,
            body,
            created_at,
            Users(role)
            """
        )
        .eq("shift_id", shift_id)
        .order("created_at")
        .execute()
    )
    return [_format_comment(dict(row)) for row in result.data or []]


def list_for_client(shift_id: str, current_user):
    shift_service.get_shift_for_client(shift_id, current_user)
    return list_for_shift(shift_id)


def list_for_caregiver(shift_id: str, current_user):
    shift_service.get_shift_for_caregiver(shift_id, current_user)
    return list_for_shift(shift_id)


def list_for_admin(shift_id: str, current_user):
    shift_service.get_shift(shift_id, current_user)
    return list_for_shift(shift_id)


def _create_comment(shift_id: str, body: ShiftCommentCreate, current_user):
    result = (
        supabase.table(TABLE)
        .insert(
            {
                "shift_id": shift_id,
                "author_user_id": current_user["user_id"],
                "author_first_name": current_user.get("first_name") or "",
                "body": body.body,
            }
        )
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to add comment")
    created = result.data[0]
    created["author_role"] = current_user.get("role")
    return created


def create_for_client(shift_id: str, body: ShiftCommentCreate, current_user):
    shift = shift_service.get_shift_for_client(shift_id, current_user)
    if shift.get("status") not in CLIENT_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Comments cannot be added on a cancelled shift",
        )
    return _create_comment(shift_id, body, current_user)


def create_for_caregiver(shift_id: str, body: ShiftCommentCreate, current_user):
    shift = shift_service.get_shift_for_caregiver(shift_id, current_user)
    if shift.get("status") not in CAREGIVER_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Caregivers can comment while the shift is in progress or completed",
        )
    return _create_comment(shift_id, body, current_user)


def create_for_admin(shift_id: str, body: ShiftCommentCreate, current_user):
    shift = shift_service.get_shift(shift_id, current_user)
    if shift.get("status") in ADMIN_BLOCKED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Comments cannot be added on a cancelled shift",
        )
    return _create_comment(shift_id, body, current_user)
