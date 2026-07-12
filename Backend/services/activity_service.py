from database.supabase import supabase
from models.activity import ActivityCreate, ActivityUpdate

def get_activities(current_user):

    result = (
        supabase
        .table("Activities")
        .select("*")
        .execute()
    ) 
    return result.data

def update_activity(activity_id: str,activity: ActivityUpdate):
    result = (
    supabase
    .table("Activities")
    .update({
        "Name": activity.Name
    })
    .eq("activity_id", activity_id)
    .execute()
    
)   
    return result.data

def add_activity(activity: ActivityCreate):

    response = (
        supabase.table("Activities")
        .insert(
            {
                "Name": activity.Name
            }
        )
        .execute()
    )

    return response.data

def delete_activity(activity_id: str):

    response = (
    supabase
    .table("Activities")
    .delete()
    .eq("activity_id", activity_id)
    .execute()
    )
    return response.data