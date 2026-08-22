from typing import Optional

from auth.dependencies import require_admin
from fastapi import APIRouter, Depends
from models.shift import ShiftAssign, ShiftCreate, ShiftUpdate
from models.shift_comment import ShiftCommentCreate
from services import shift_activity_service, shift_comment_service, shift_service

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])


@router.get("/shifts")
def list_shifts(
    status: Optional[str] = None,
    client_id: Optional[str] = None,
    caregiver_id: Optional[str] = None,
    start_from: Optional[str] = None,
    start_to: Optional[str] = None,
    current_user=Depends(require_admin),
):
    return shift_service.list_shifts(
        current_user,
        status=status,
        client_id=client_id,
        caregiver_id=caregiver_id,
        start_from=start_from,
        start_to=start_to,
    )


@router.get("/shifts/{shift_id}")
def get_shift(shift_id: str, current_user=Depends(require_admin)):
    return shift_service.get_shift(shift_id, current_user, include_visit=True)


@router.post("/shifts")
def create_shift(shift: ShiftCreate, current_user=Depends(require_admin)):
    return shift_service.create_shift(shift, current_user)


@router.patch("/shifts/{shift_id}")
def update_shift(
    shift_id: str,
    shift: ShiftUpdate,
    current_user=Depends(require_admin),
):
    return shift_service.update_shift(shift_id, shift, current_user)


@router.post("/shifts/{shift_id}/assign")
def assign_shift(
    shift_id: str,
    body: ShiftAssign,
    current_user=Depends(require_admin),
):
    return shift_service.assign_shift(shift_id, body, current_user)


@router.post("/shifts/{shift_id}/unassign")
def unassign_shift(shift_id: str, current_user=Depends(require_admin)):
    return shift_service.unassign_shift(shift_id, current_user)


@router.post("/shifts/{shift_id}/reassign")
def reassign_shift(
    shift_id: str,
    body: ShiftAssign,
    current_user=Depends(require_admin),
):
    return shift_service.reassign_shift(shift_id, body, current_user)


@router.post("/shifts/{shift_id}/cancel")
def cancel_shift(shift_id: str, current_user=Depends(require_admin)):
    return shift_service.cancel_shift(shift_id, current_user)


@router.get("/shifts/{shift_id}/activities")
def list_shift_activities(shift_id: str, current_user=Depends(require_admin)):
    return shift_activity_service.list_for_admin(shift_id, current_user)


@router.get("/shifts/{shift_id}/comments")
def list_shift_comments(shift_id: str, current_user=Depends(require_admin)):
    return shift_comment_service.list_for_admin(shift_id, current_user)


@router.post("/shifts/{shift_id}/comments")
def add_shift_comment(
    shift_id: str,
    body: ShiftCommentCreate,
    current_user=Depends(require_admin),
):
    return shift_comment_service.create_for_admin(shift_id, body, current_user)
