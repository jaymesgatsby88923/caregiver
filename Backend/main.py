from fastapi import FastAPI
from routes.activities import router as activities_router
from routes.caregivers import router as caregivers_router
from routes.clients import router as client_router
from routes.auth import router as auth_router
from routes.assignments import router as assignments_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://caringangels.io",
        "https://www.caringangels.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_router)
app.include_router(activities_router)
app.include_router(caregivers_router)
app.include_router(auth_router)
app.include_router(assignments_router)
