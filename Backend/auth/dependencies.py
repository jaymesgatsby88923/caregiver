from database.supabase import supabase
from models.auth import LoginRequest, SignUpRequest
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException

security = HTTPBearer()

def get_current_user(credentials = Depends(security)):

    token = credentials.credentials
    try:
     user = supabase.auth.get_user(token)
    
    except Exception:
        raise HTTPException(
        status_code=401,
        detail="Invalid or expired token"
    )
   
    auth_user_id = user.user.id

    response = (
        supabase
        .table("Users")
        .select("*")
        .eq("auth_user_id", auth_user_id)
        .execute()
    )

   
    return response.data[0]








