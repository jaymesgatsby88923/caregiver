from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
import os
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

class caregiverModel(BaseModel):
    fName:Optional[str] = None 
    lName:Optional[str] = None
    rate:Optional[str] = None
    phone:Optional[str] = None
    email:Optional[str] = None


app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY= os.getenv("SUPABASE_KEY")


supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


@app.get("/caregivers")
def loadcaregivers() :
    result = (
        supabase
        .table("Caregivers")
        .select("*")
        .execute()
    )
    
    return result.data

@app.patch("/caregivers/{caregiver_id}")

def update_caregiver(caregiver_id: str,caregiver: caregiverModel):


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

@app.post("/caregivers")

def add_caregiver(caregiver: caregiverModel):

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
    
@app.delete("/caregivers/{caregiver_id}")

def deleteCaregiver(caregiver_id: str):

    response = (
    supabase
    .table("Caregivers")
    .delete()
    .eq("caregiver_id", caregiver_id)
    .execute()
    )
    return response.data