from typing import Optional

from auth.dependencies import require_client
from fastapi import APIRouter, Depends
from models.shift_comment import ShiftCommentCreate
from services import shift_activity_service, shift_comment_service, shift_service

router = APIRouter(prefix="/client", dependencies=[Depends(require_client)])


@router.get("/shifts")
def list_my_shifts(
    status: Optional[str] = None,
    start_from: Optional[str] = None,
    start_to: Optional[str] = None,
    current_user=Depends(require_client),
):
    return shift_service.list_shifts_for_client(
        current_user,
        status=status,
        start_from=start_from,
        start_to=start_to,
    )


@router.get("/shifts/{shift_id}")
def get_my_shift(shift_id: str, current_user=Depends(require_client)):
    return shift_service.get_shift_for_client(
        shift_id, current_user, include_visit=True
    )


@router.get("/shifts/{shift_id}/activities")
def list_shift_activities(shift_id: str, current_user=Depends(require_client)):
    return shift_activity_service.list_for_client(shift_id, current_user)


@router.get("/shifts/{shift_id}/comments")
def list_shift_comments(shift_id: str, current_user=Depends(require_client)):
    return shift_comment_service.list_for_client(shift_id, current_user)


@router.post("/shifts/{shift_id}/comments")
def add_shift_comment(
    shift_id: str,
    body: ShiftCommentCreate,
    current_user=Depends(require_client),
):
    return shift_comment_service.create_for_client(shift_id, body, current_user)
