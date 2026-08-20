from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import HTTPBearer
from auth import auth_service
from models.auth import (
    ForgotPasswordRequest,
    LoginRequest,
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
    return auth_service.signup(signup_request)

@router.get("/current-user")
def current_user(current_user = Depends(get_current_user)):
    return {
        "first_name": current_user["first_name"],
        "role": current_user["role"]
    }


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest):
    return auth_service.forgot_password(body)


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest):
    return auth_service.reset_password(body)