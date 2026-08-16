from database.supabase import supabase
from models.assignments import AssignmentCreate, AssignmentUpdate

def get_careteam(client_id: str, current_user):

    result = (
        supabase
        .table("Assignments")
        .select("""
        assignment_id,
        caregiver_id,
        Caregivers(
            user_id,
            Users(
                first_name,
                last_name
            )
        )
    """)

        .eq("client_id", client_id)
        .eq("active",True)
        .execute()
    ) 
    print(result.data)
    return result.data

def update_assignment(assignment_id,assignment: AssignmentUpdate,current_user):
    update_data = assignment.model_dump(exclude_unset=True)
    result = (
    supabase
    .table("Assignments")
    .update(update_data)
    .eq("assignment_id", assignment_id,
        )
    .execute()
    
)   
    return result.data

def add_assignment(assignment: AssignmentCreate,current_user):
    response = (
        supabase.table("Assignments")
        .insert(
            {
                "client_id": assignment.client_id,
                "caregiver_id": assignment.caregiver_id,
                "start_date": assignment.start_date,
                "end_date": assignment.end_date,
                "active": True,
            }
        )
        .execute()
    )

    return response.data

def delete_assignment(assignment_id: str):

    response = (
    supabase
    .table("Assignments")
    .delete()
    .eq("assignment_id", assignment_id)
    .execute()
    )
    return response.data