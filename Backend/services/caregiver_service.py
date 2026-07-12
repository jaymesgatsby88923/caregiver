from database.supabase import supabase
from models.caregiver import CaregiverCreate, CaregiverUpdate

def get_caregivers() :
    result = (
        supabase
        .table("Caregivers")
        .select("*")
        .execute()
    )
    
    return result.data

def update_caregiver(caregiver_id: str,caregiver: CaregiverUpdate):


    result = (
    supabase
    .table("Caregivers")
    .update({
         "fName":caregiver.fName,
        "lName":caregiver.lName,
        "rate":caregiver.rate,
        "phone":caregiver.phone,
        "email":caregiver.email
    })
    .eq("caregiver_id", caregiver_id)
    .execute()
    
)

   
    return result.data

def add_caregiver(caregiver: CaregiverCreate):

    response = (
        supabase.table("Caregivers")
        .insert(
            {
        "fName":caregiver.fName,
        "lName":caregiver.lName,
        "rate":caregiver.rate,
        "phone":caregiver.phone,
        "email":caregiver.email
            }
        )
        .execute()
    )

    return response.data


def deleteCaregiver(caregiver_id: str):

    response = (
    supabase
    .table("Caregivers")
    .delete()
    .eq("caregiver_id", caregiver_id)
    .execute()
    )
    return response.data