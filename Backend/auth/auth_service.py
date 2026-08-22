import os

from database.supabase import SUPABASE_KEY, SUPABASE_URL, supabase
from fastapi import HTTPException
from supabase import create_client
from auth.dependencies import TRANSIENT_HTTPX, service_unavailable
from models.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    ResetPasswordRequest,
    SignUpRequest,
)

def signup(signup_request: SignUpRequest):
  
    
    result = supabase.auth.sign_up({
        "email":signup_request.email,
        "password":signup_request.password
    }
    )

  
    auth_user_id = result.user.id

   
    response = (
        supabase.table("Users")
        .insert(
            {
                "first_name":signup_request.first_name,
                "last_name":signup_request.last_name,
                "email":signup_request.email,
                "role":signup_request.role,
                "auth_user_id":auth_user_id


            }
        )
        .execute()
    )

  
    return response.data


  
def login(login_request: LoginRequest):

  
    result = supabase.auth.sign_in_with_password({
        "email":login_request.email,
        "password":login_request.password
    }

    )
    return {
            "access_token":result.session.access_token,
            "refresh_token":result.session.refresh_token
    }


def _reset_redirect_url() -> str:
    return os.getenv(
        "PASSWORD_RESET_REDIRECT_URL",
        "https://caringangels.io/reset-password",
    )


def forgot_password(body: ForgotPasswordRequest):
    # Always succeed so the response does not reveal whether the email exists.
    try:
        supabase.auth.reset_password_for_email(
            body.email,
            {"redirect_to": _reset_redirect_url()},
        )
    except Exception:
        pass
    return {"ok": True}


def refresh(body: RefreshRequest):
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        result = client.auth.refresh_session(body.refresh_token)
    except TRANSIENT_HTTPX:
        raise service_unavailable()
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token",
        )

    session = result.session
    if not session or not session.access_token or not session.refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token",
        )

    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
    }


def logout(body: LogoutRequest):
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        if body.access_token:
            try:
                client.auth.set_session(body.access_token, body.refresh_token)
            except Exception:
                client.auth.refresh_session(body.refresh_token)
        else:
            client.auth.refresh_session(body.refresh_token)
        client.auth.sign_out()
    except Exception:
        pass
    return {"ok": True}


def reset_password(body: ResetPasswordRequest):
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        if body.code:
            client.auth.exchange_code_for_session({"auth_code": body.code})
        else:
            client.auth.set_session(body.access_token, body.refresh_token)
        client.auth.update_user({"password": body.password})
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or expired. Request a new one.",
        )
    return {"ok": True}

