from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ShiftActivityCreate(BaseModel):
    activity_id: str
    notes: Optional[str] = None
    logged_at: Optional[datetime] = None
