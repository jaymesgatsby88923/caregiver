import os
from typing import Optional

from fastapi import HTTPException
from supabase import create_client

from database.supabase import SUPABASE_KEY, SUPABASE_URL, supabase


def reset_redirect_url() -> str:
    return os.getenv(
        "PASSWORD_RESET_REDIRECT_URL",
        "https://caringangels.io/reset-password",
    )


def _admin_client():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def _invite_error_message(exc: Exception) -> str:
    message = str(exc)
    if "already been registered" in message.lower() or "already registered" in message.lower():
        return "A login already exists for this email"
    return "Unable to send invite. Check the email and try again."


def require_invite_email(email) -> str:
    if email is None or not str(email).strip() or not isinstance(email, str):
        raise HTTPException(
            status_code=400,
            detail="Email is required to create a login",
        )
    return email.strip()


def invite_auth_user(email: str, first_name: str, last_name: str, role: str) -> str:
    client = _admin_client()
    try:
        result = client.auth.admin.invite_user_by_email(
            email,
            {
                "redirect_to": reset_redirect_url(),
                "data": {
                    "first_name": first_name or "",
                    "last_name": last_name or "",
                    "role": role,
                },
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=_invite_error_message(exc),
        ) from exc

    user = getattr(result, "user", None)
    auth_user_id = getattr(user, "id", None) if user else None
    if not auth_user_id:
        raise HTTPException(status_code=500, detail="Failed to create login")
    return auth_user_id


def delete_auth_user(auth_user_id: str):
    if not auth_user_id:
        return
    try:
        _admin_client().auth.admin.delete_user(auth_user_id)
    except Exception:
        pass


def create_app_user(
    *,
    auth_user_id: str,
    first_name: str,
    last_name: str,
    email: str,
    phone: Optional[str],
    role: str,
) -> str:
    result = (
        supabase.table("Users")
        .insert(
            {
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
                "role": role,
                "auth_user_id": auth_user_id,
            }
        )
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return result.data[0]["user_id"]


def delete_app_user(user_id: str):
    if not user_id:
        return
    try:
        supabase.table("Users").delete().eq("user_id", user_id).execute()
    except Exception:
        pass


def provision_login(*, email, first_name, last_name, phone, role: str) -> tuple[str, str]:
    email = require_invite_email(email)
    auth_user_id = invite_auth_user(email, first_name, last_name, role)
    try:
        user_id = create_app_user(
            auth_user_id=auth_user_id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            role=role,
        )
    except Exception:
        delete_auth_user(auth_user_id)
        raise
    return auth_user_id, user_id
