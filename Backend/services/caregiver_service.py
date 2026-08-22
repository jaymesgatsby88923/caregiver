from fastapi import HTTPException

from auth.provision import delete_app_user, delete_auth_user, provision_login
from database.supabase import supabase
from models.caregiver import CaregiverCreate, CaregiverUpdate

def get_caregivers() :
    response = (
        supabase
        .table("Caregivers")
        .select("""
            caregiver_id,
            rate,
            user_id,    
            active,
            Users(
                first_name,
                last_name,
                email,
                phone
            )
        """)
        .execute()
)
    caregivers = []

    for caregiver in response.data:

        caregivers.append({
        "caregiver_id": caregiver["caregiver_id"],
        "user_id": caregiver["user_id"],
        "first_name": caregiver["Users"]["first_name"],
        "last_name": caregiver["Users"]["last_name"],
        "email": caregiver["Users"]["email"],
        "phone": caregiver["Users"]["phone"],
        "rate": caregiver["rate"],
        "active": caregiver["active"]
    })

    return caregivers

def get_user(caregiver_id) :
    response = (
        supabase
        .table("Caregivers")
        .select("user_id"
            )
        .eq("caregiver_id",caregiver_id)
            
        .execute()
        )   
    

def update_caregiver(caregiver_id: str,caregiver: CaregiverUpdate):

    user_fields_update(caregiver)
    caregiver_fields_update(caregiver_id,caregiver)
    

def user_fields_update(caregiver: CaregiverUpdate):

      response = (
        supabase.table("Users")
        .update(
            {
         "first_name":caregiver.first_name,
         "last_name":caregiver.last_name,
         "phone":caregiver.phone,
         "email":caregiver.email
            }
        )
        .eq("user_id",caregiver.user_id)
        .execute()
        )   
      
      
    

def caregiver_fields_update(caregiver_id,caregiver: CaregiverUpdate):
    response = (
        supabase.table("Caregivers")
        .update(
            {
        
          "rate":caregiver.rate,
          "active":caregiver.active
            }
        )
        .eq("caregiver_id",caregiver_id)
        .execute()
    )                
    

def add_caregiver(caregiver: CaregiverCreate):
    auth_user_id, user_id = provision_login(
        email=caregiver.email,
        first_name=caregiver.first_name,
        last_name=caregiver.last_name,
        phone=caregiver.phone,
        role="caregiver",
    )
    try:
        result = (
            supabase.table("Caregivers")
            .insert(
                {
                    "rate": caregiver.rate,
                    "user_id": user_id,
                }
            )
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create caregiver")
        return result.data
    except Exception:
        delete_app_user(user_id)
        delete_auth_user(auth_user_id)
        raise


def delete_caregiver(caregiver_id: str):

    response = (
    supabase
    .table("Caregivers")
    .delete()
    .eq("caregiver_id", caregiver_id)
    .execute()
    )
    return response.data
