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
    


#Add

def add_caregiver(caregiver: CaregiverCreate):
    
    user = user_fields_add(caregiver)
    caregiver_fields_add(caregiver,user)
    
    
   

  

def user_fields_add(caregiver: CaregiverCreate):
      user_id ="" 

      response = (
        supabase.table("Users")
        .insert(
            {
         "first_name":caregiver.first_name,
         "last_name":caregiver.last_name,
         "phone":caregiver.phone,
         "email":caregiver.email,
         "role":"caregiver",
         "auth_user_id":caregiver.email
            }
        )
        .execute()
        )   
      return response.data[0]["user_id"]
    

def caregiver_fields_add(caregiver: CaregiverCreate,user_id):
      response = (
        supabase.table("Caregivers")
        .insert(
            {
        
          "rate":caregiver.rate,
          "user_id":user_id
            }
        )
        .execute()
    )                
    

def delete_caregiver(caregiver_id: str):

    response = (
    supabase
    .table("Caregivers")
    .delete()
    .eq("caregiver_id", caregiver_id)
    .execute()
    )
    return response.data