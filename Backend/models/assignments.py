from pydantic import BaseModel
from typing import Optional

# Assignments table: assignment_id, client_id, caregiver_id, active
class AssignmentCreate(BaseModel):
    client_id: str
    caregiver_id: str

class AssignmentUpdate(BaseModel):
    active: Optional[bool] = None
