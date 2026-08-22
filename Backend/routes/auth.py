from fastapi import APIRouter, Depends, HTTPException
from auth import auth_service
from models.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    ResetPasswordRequest,
    SignUpRequest,
)
from auth.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(login_request: LoginRequest):
    return auth_service.login(login_request)


@router.post("/signup")
def signup(signup_request: SignUpRequest):
    raise HTTPException(status_code=403, detail="Account creation is admin-only")

@router.get("/current-user")
def current_user(current_user = Depends(get_current_user)):
    return {
        "first_name": current_user["first_name"],
        "role": current_user["role"]
    }


@router.post("/refresh")
def refresh(body: RefreshRequest):
    return auth_service.refresh(body)


@router.post("/logout")
def logout(body: LogoutRequest):
    return auth_service.logout(body)


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest):
    return auth_service.forgot_password(body)


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest):
    return auth_service.reset_password(body)