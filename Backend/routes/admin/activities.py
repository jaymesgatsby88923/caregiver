from auth.dependencies import require_admin
from fastapi import APIRouter, Depends
from models.activity import ActivityCreate, ActivityUpdate
from services import activity_service

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])


@router.get("/activities")
def get_activities(current_user=Depends(require_admin)):
    return activity_service.get_activities(current_user)


@router.patch("/activities/{activity_id}")
def update_activity(
    activity_id: str,
    activity: ActivityUpdate,
    current_user=Depends(require_admin),
):
    return activity_service.update_activity(activity_id, activity, current_user)


@router.post("/activities")
def add_activity(activity: ActivityCreate, current_user=Depends(require_admin)):
    return activity_service.add_activity(activity, current_user)


@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: str, current_user=Depends(require_admin)):
    return activity_service.delete_activity(activity_id, current_user)
