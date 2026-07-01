from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
import os
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class ActivityUpdate(BaseModel):
    Name: str

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


@app.get("/activities")
def activities() :
    result = (
        supabase
        .table("Activities")
        .select("*")
        .execute()
    )
    print(result.data)
    return result.data

@app.patch("/activities/{activity_id}")

def update_activity(activity_id: int,activity: ActivityUpdate):


    result = (
    supabase
    .table("Activities")
    .update({
        "Name": activity.Name
    })
    .eq("id", activity_id)
    .execute()
    
)

   
    return result.data

@app.post("/activities")

def add_activity(activity: ActivityUpdate):

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
    
@app.delete("/activities/{activity_id}")

def deleteActivity(activity_id: int):

    response = (
    supabase
    .table("Activities")
    .delete()
    .eq("id", activity_id)
    .execute()
    )
    return response.data