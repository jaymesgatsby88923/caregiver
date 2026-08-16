from pydantic import BaseModel
from typing import Optional
  

class ActivityCreate(BaseModel):
    name: str
    
class ActivityUpdate(BaseModel):
    name: Optional[str] = None 
    active: Optional[bool]=None