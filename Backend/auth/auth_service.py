from database.supabase import supabase
from models.auth import LoginRequest, SignUpRequest
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException

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


