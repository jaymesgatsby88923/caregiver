from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator


class SignUpRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str
    access_token: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    password: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    code: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_long_enough(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value

    @model_validator(mode="after")
    def has_recovery_credentials(self):
        if self.code:
            return self
        if self.access_token and self.refresh_token:
            return self
        raise ValueError("Reset link is missing or expired")
