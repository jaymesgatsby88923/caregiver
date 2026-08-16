from pydantic import BaseModel, EmailStr
from typing import Optional

class AssignmentCreate(BaseModel):
    client_id: Optional[str] = None
    caregiver_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class AssignmentUpdate(BaseModel):
    assignment_id: Optional[str] = None
    client_id: Optional[str] = None
    caregiver_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None  

