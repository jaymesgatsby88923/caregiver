from pydantic import BaseModel
from typing import Optional

class CaregiverCreate(BaseModel):

    fName:Optional[str] = None 
    lName:Optional[str] = None
    rate:Optional[str] = None
    phone:Optional[str] = None
    email:Optional[str] = None

class CaregiverUpdate(BaseModel):
    fName:Optional[str] = None 
    lName:Optional[str] = None
    rate:Optional[str] = None
    phone:Optional[str] = None
    email:Optional[str] = None