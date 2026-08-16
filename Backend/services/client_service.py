from database.supabase import supabase
from models.client import ClientCreate, ClientUpdate

def get_clients(current_user):

    result = (
        supabase
        .table("Clients")
        .select("*")
        .execute()
    ) 
    return result.data

def update_client(client_id,client: ClientUpdate,current_user):
    result = (
    supabase
    .table("Clients")
    .update({
        "first_name": client.first_name,
        "last_name":client.last_name,
        "billing_rate":client.billing_rate,
        "phone":client.phone,
        "email":client.email,
        "address":client.address,
        "notes":client.notes,
        "active":client.active
    })
    .eq("client_id", client_id,
        )
    .execute()
    
)   
    return result.data

def add_client(client: ClientCreate,current_user):
   

    response = (
        supabase.table("Clients")
        .insert(
            {
        "first_name": client.first_name,
        "last_name":client.last_name,
        "billing_rate":client.billing_rate,
        "phone":client.phone,
        "email":client.email,
        "address":client.address,
        "notes":client.notes
            }
        )
        .execute()
    )

    return response.data

def delete_client(client_id: str):

    response = (
    supabase
    .table("Clients")
    .delete()
    .eq("client_id", client_id)
    .execute()
    )
    return response.data