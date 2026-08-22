import httpx
from database.supabase import supabase
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException

security = HTTPBearer()

TRANSIENT_HTTPX = (httpx.TimeoutException, httpx.TransportError)


def service_unavailable():
    return HTTPException(
        status_code=503,
        detail="Authentication service unavailable",
    )


def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
    except TRANSIENT_HTTPX:
        raise service_unavailable()
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    auth_user_id = user.user.id

    try:
        response = (
            supabase.table("Users")
            .select("*")
            .eq("auth_user_id", auth_user_id)
            .execute()
        )
    except TRANSIENT_HTTPX:
        raise service_unavailable()

    if not response.data:
        raise HTTPException(status_code=401, detail="User not found")

    return response.data[0]


def require_admin(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def require_caregiver(current_user=Depends(get_current_user)):
    if current_user.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregiver access required")
    return current_user


def require_client(current_user=Depends(get_current_user)):
    if current_user.get("role") != "client":
        raise HTTPException(status_code=403, detail="Client access required")
    return current_user








