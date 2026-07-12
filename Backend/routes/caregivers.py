from services import caregiver_service
from fastapi import APIRouter
from models.caregiver import CaregiverCreate, CaregiverUpdate

router = APIRouter()

@router.get("/caregivers")
def get_caregivers():
    return caregiver_service.get_caregiver()

@router.patch("/caregivers/{caregiver_id}")
def update_caregiver(caregiver_id: str,caregiver: CaregiverUpdate):
    return caregiver_service.update_caregiver(caregiver_id,caregiver)

@router.post("/caregivers")
def add_caregiver(caregiver: CaregiverCreate):
    return caregiver_service.add_caregiver(caregiver)

@router.delete("/caregivers/{caregiver_id}")
def delete_caregiver(caregiver_id: str):
    return caregiver_service.delete_caregiver(caregiver_id)