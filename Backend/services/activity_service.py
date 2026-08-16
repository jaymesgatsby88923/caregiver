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

def update_activity(activity_id,activity: ActivityUpdate,current_user):

    update_data = activity.model_dump(exclude_unset=True)

    result = (
    supabase
    .table("Activities")
    .update(
      update_data
    )
    .eq("activity_id", activity_id,
        )
    .execute()
    
)   
    return result.data

def add_activity(activity: ActivityCreate,current_user):
    print(activity) 

    response = (
        supabase.table("Activities")
        .insert(
            {
                "name": activity.name
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