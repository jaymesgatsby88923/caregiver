from pydantic import BaseModel, field_validator


class ShiftCommentCreate(BaseModel):
    body: str

    @field_validator("body")
    @classmethod
    def not_empty(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Comment cannot be empty")
        return trimmed
