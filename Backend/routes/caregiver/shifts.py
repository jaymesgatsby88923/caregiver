from typing import Optional

from auth.dependencies import require_caregiver
from fastapi import APIRouter, Depends
from models.shift_activity import ShiftActivityCreate
from models.shift_comment import ShiftCommentCreate
from services import (
    client_service,
    shift_activity_service,
    shift_comment_service,
    shift_service,
)

router = APIRouter(prefix="/caregiver", dependencies=[Depends(require_caregiver)])


@router.get("/activities")
def list_active_activities(current_user=Depends(require_caregiver)):
    return shift_activity_service.get_active_catalog(current_user)


@router.get("/clients")
def list_my_clients(current_user=Depends(require_caregiver)):
    return client_service.list_clients_for_caregiver(current_user)


@router.get("/shifts")
def list_my_shifts(
    status: Optional[str] = None,
    start_from: Optional[str] = None,
    start_to: Optional[str] = None,
    current_user=Depends(require_caregiver),
):
    return shift_service.list_shifts_for_caregiver(
        current_user,
        status=status,
        start_from=start_from,
        start_to=start_to,
    )


@router.get("/shifts/{shift_id}")
def get_my_shift(shift_id: str, current_user=Depends(require_caregiver)):
    return shift_service.get_shift_for_caregiver(shift_id, current_user)


@router.post("/shifts/{shift_id}/clock-in")
def clock_in(shift_id: str, current_user=Depends(require_caregiver)):
    return shift_service.clock_in(shift_id, current_user)


@router.post("/shifts/{shift_id}/clock-out")
def clock_out(shift_id: str, current_user=Depends(require_caregiver)):
    return shift_service.clock_out(shift_id, current_user)


@router.get("/shifts/{shift_id}/activities")
def list_shift_activities(shift_id: str, current_user=Depends(require_caregiver)):
    return shift_activity_service.list_for_caregiver(shift_id, current_user)


@router.post("/shifts/{shift_id}/activities")
def log_shift_activity(
    shift_id: str,
    body: ShiftActivityCreate,
    current_user=Depends(require_caregiver),
):
    return shift_activity_service.log_for_caregiver(shift_id, body, current_user)


@router.delete("/shifts/{shift_id}/activities/{shift_activity_id}")
def delete_shift_activity(
    shift_id: str,
    shift_activity_id: str,
    current_user=Depends(require_caregiver),
):
    return shift_activity_service.delete_for_caregiver(
        shift_id, shift_activity_id, current_user
    )


@router.get("/shifts/{shift_id}/comments")
def list_shift_comments(shift_id: str, current_user=Depends(require_caregiver)):
    return shift_comment_service.list_for_caregiver(shift_id, current_user)


@router.post("/shifts/{shift_id}/comments")
def add_shift_comment(
    shift_id: str,
    body: ShiftCommentCreate,
    current_user=Depends(require_caregiver),
):
    return shift_comment_service.create_for_caregiver(shift_id, body, current_user)
