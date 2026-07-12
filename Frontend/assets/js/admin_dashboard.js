/*
==========================================================
CareApp Admin Dashboard
----------------------------------------------------------
Handles:
- Loading current user
- Loading dashboard statistics
- Logout
==========================================================
*/


// ===========================
// Elements
// ===========================

const welcomeName = document.getElementById("welcome-name");

const activeShifts = document.getElementById("active-shifts");
const openShifts = document.getElementById("open-shifts");
const totalClients = document.getElementById("total-clients");
const totalCaregivers = document.getElementById("total-caregivers");

const logoutButton = document.getElementById("logout-button");


// ===========================
// Startup
// ===========================

document.addEventListener("DOMContentLoaded", initializeDashboard);


// ===========================
// Initialize
// ===========================

async function initializeDashboard(){

    await loadCurrentUser();

    await loadDashboard();

}


// ===========================
// Current User
// ===========================

async function loadCurrentUser(){

    const token = getAccessToken();

    if(!token){

        window.location.href = "../login.html";

        return;

    }

    const response = await fetch(
        "http://127.0.0.1:8000/auth/current-user",
        {
            method:"GET",

            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    if(!response.ok){

        localStorage.clear();

        window.location.href="../login.html";

        return;

    }

    const currentUser = await response.json();

    welcomeName.textContent = currentUser.first_name;

}


// ===========================
// Dashboard Stats
// ===========================

async function loadDashboard(){

    /*
        We'll replace these placeholder
        values with a real API later.
    */

    activeShifts.textContent = 24;
    openShifts.textContent = 7;
    totalClients.textContent = 138;
    totalCaregivers.textContent = 62;

}


// ===========================
// Logout
// ===========================

logoutButton.addEventListener("click", logout);


function logout(){

    localStorage.removeItem("access_token");

    localStorage.removeItem("first_name");

    window.location.href = "../login.html";

}