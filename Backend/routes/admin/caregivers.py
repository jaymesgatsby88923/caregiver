from auth.dependencies import require_admin
from fastapi import APIRouter, Depends
from models.caregiver import CaregiverCreate, CaregiverUpdate
from services import caregiver_service

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])


@router.get("/caregivers")
def get_caregivers(current_user=Depends(require_admin)):
    return caregiver_service.get_caregivers()


@router.patch("/caregivers/{caregiver_id}")
def update_caregiver(
    caregiver_id: str,
    caregiver: CaregiverUpdate,
    current_user=Depends(require_admin),
):
    return caregiver_service.update_caregiver(caregiver_id, caregiver)


@router.post("/caregivers")
def add_caregiver(caregiver: CaregiverCreate, current_user=Depends(require_admin)):
    return caregiver_service.add_caregiver(caregiver)


@router.delete("/caregivers/{caregiver_id}")
def delete_caregiver(caregiver_id: str, current_user=Depends(require_admin)):
    return caregiver_service.delete_caregiver(caregiver_id)
