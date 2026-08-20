from pydantic import BaseModel, EmailStr
from typing import Optional

class ClientCreate(BaseModel):
    first_name:Optional[str] = None, 
    last_name:Optional[str] = None,
    billing_rate:Optional[int] = None
    phone:Optional[str] = None
    email:Optional[EmailStr] = None,
    address:Optional[str] =None
    notes: Optional[str]=None

class ClientUpdate(BaseModel):
    first_name:Optional[str] = None 
    last_name:Optional[str] = None
    billing_rate:Optional[int] = None
    phone:Optional[str] = None
    email:Optional[EmailStr] = None
    address:Optional[str] =None
    notes: Optional[str]=None
    active: Optional[bool]=None


class CaregiverClient(BaseModel):
    client_id: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
