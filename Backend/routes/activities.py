from services import activity_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from models.activity import ActivityCreate, ActivityUpdate
from auth.dependencies import get_current_user

security = HTTPBearer()
router = APIRouter()

@router.get("/activities")
def get_activities( current_user = Depends(get_current_user)):
    return activity_service.get_activities(current_user)

@router.patch("/activities/{activity_id}")
def update_activity(activity_id: str,activity: ActivityUpdate,current_user = Depends(get_current_user)):
    return activity_service.update_activity(activity_id,activity,current_user)

@router.post("/activities")
def add_activity(activity: ActivityCreate,current_user = Depends(get_current_user)):
    return activity_service.add_activity(activity,current_user)

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: str,current_user = Depends(get_current_user)):
    return activity_service.delete_activity(activity_id,current_user)