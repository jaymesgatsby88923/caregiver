from services import client_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from models.client import ClientCreate, ClientUpdate
from auth.dependencies import get_current_user

security = HTTPBearer()
router = APIRouter()

@router.get("/clients")
def get_clients( current_user = Depends(get_current_user)):
    return client_service.get_clients(current_user)

@router.patch("/clients/{client_id}")
def update_client(client_id: str,client: ClientUpdate,current_user = Depends(get_current_user)):
    return client_service.update_client(client_id,client,current_user)

@router.post("/clients")
def add_client(client: ClientCreate,current_user = Depends(get_current_user)):
    return client_service.add_client(client,current_user)

@router.delete("/clients/{client_id}")
def delete_client(client_id: str,current_user = Depends(get_current_user)):
    return client_service.delete_client(client_id,current_user)