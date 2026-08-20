from database.supabase import supabase
from fastapi import HTTPException
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


def _caregiver_id_for_user(current_user) -> str:
    result = (
        supabase.table("Caregivers")
        .select("caregiver_id")
        .eq("user_id", current_user["user_id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Caregiver profile not found")
    return result.data[0]["caregiver_id"]


def _related_client(value):
    if isinstance(value, list):
        return value[0] if value else None
    if isinstance(value, dict):
        return value
    return None


def list_clients_for_caregiver(current_user):
    caregiver_id = _caregiver_id_for_user(current_user)
    result = (
        supabase.table("Assignments")
        .select(
            """
            Clients(
                client_id,
                first_name,
                last_name,
                phone,
                address,
                notes,
                active
            )
            """
        )
        .eq("caregiver_id", caregiver_id)
        .eq("active", True)
        .execute()
    )

    clients = []
    for row in result.data or []:
        client = _related_client(row.get("Clients"))
        if not client or not client.get("active", True):
            continue
        clients.append(
            {
                "client_id": client["client_id"],
                "first_name": client.get("first_name"),
                "last_name": client.get("last_name"),
                "phone": client.get("phone"),
                "address": client.get("address"),
                "notes": client.get("notes"),
            }
        )
    return clients