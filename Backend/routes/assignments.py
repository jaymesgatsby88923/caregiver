from services import assignment_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from models.assignments import AssignmentCreate, AssignmentUpdate
from auth.dependencies import get_current_user

security = HTTPBearer()
router = APIRouter()

@router.get("/careteam/{client_id}")
def get_assignments( client_id: str, current_user = Depends(get_current_user)):
    return assignment_service.get_careteam(client_id,current_user)


@router.patch("/assignments/{assignment_id}")
def update_assignment(assignment_id: str,assignment: AssignmentUpdate,current_user = Depends(get_current_user)):
    return assignment_service.update_assignment(assignment_id,assignment,current_user)

@router.post("/assignments")
def add_assignment(assignment: AssignmentCreate,current_user = Depends(get_current_user)):
    return assignment_service.add_assignment(assignment,current_user)

@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: str, current_user = Depends(get_current_user)):
    return assignment_service.delete_assignment(assignment_id)