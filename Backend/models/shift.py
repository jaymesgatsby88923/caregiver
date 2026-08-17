from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class ShiftCreate(BaseModel):
    client_id: str
    caregiver_id: Optional[str] = None
    scheduled_start_at: datetime
    scheduled_end_at: datetime

    @field_validator("scheduled_end_at")
    @classmethod
    def end_after_start(cls, end: datetime, info):
        start = info.data.get("scheduled_start_at")
        if start and end <= start:
            raise ValueError("scheduled_end_at must be after scheduled_start_at")
        return end


class ShiftUpdate(BaseModel):
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None


class ShiftAssign(BaseModel):
    caregiver_id: str
