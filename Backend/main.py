from fastapi import FastAPI
from routes.admin.activities import router as admin_activities_router
from routes.admin.assignments import router as admin_assignments_router
from routes.admin.caregivers import router as admin_caregivers_router
from routes.admin.clients import router as admin_clients_router
from routes.admin.shifts import router as admin_shifts_router
from routes.auth import router as auth_router
from routes.caregiver.shifts import router as caregiver_shifts_router
from routes.client.shifts import router as client_shifts_router
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

app.include_router(auth_router)
app.include_router(admin_clients_router)
app.include_router(admin_activities_router)
app.include_router(admin_caregivers_router)
app.include_router(admin_assignments_router)
app.include_router(admin_shifts_router)
app.include_router(caregiver_shifts_router)
app.include_router(client_shifts_router)
