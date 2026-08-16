from pydantic import BaseModel, EmailStr
from typing import Optional

class CaregiverCreate(BaseModel):

    first_name:Optional[str] = None 
    last_name:Optional[str] = None
    rate:Optional[int] = None
    phone:Optional[str] = None
    email:Optional[EmailStr] = None
    rate: Optional[int] = None

class CaregiverUpdate(BaseModel):
    caregiver_id:Optional[str] = None
    first_name:Optional[str] = None 
    last_name:Optional[str] = None
    rate:Optional[int] = None
    phone:Optional[int] = None
    email:Optional[EmailStr] = None
    active: Optional[bool] = None
    user_id: Optional[str] = None

class CaregiverResponse(BaseModel):
    caregiver_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    rate: int
    active: bool