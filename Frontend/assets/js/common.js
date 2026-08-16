/*
==========================================================
CareApp - Common JavaScript

Shared functionality used throughout the application.
==========================================================
*/


// ===========================
// JWT Functions
// ===========================

function setAccessToken(token){

    localStorage.setItem("access_token", token);

}


function getAccessToken(){

    return localStorage.getItem("access_token");

}


function removeAccessToken(){

    localStorage.removeItem("access_token");

}

async function loadCurrentUser(){

    const token = getAccessToken();

    if(!token){

        window.location.href = "../login.html";

        return;

    }

    const response = await fetch(
        "http://127.0.0.1:8000/auth/current-user",
        {
            method: "GET",
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    );

    if(!response.ok){

        localStorage.clear();

        window.location.href = "../pages/login.html";

        return;

    }

    const currentUser = await response.json();

    document
        .getElementById("welcome-name")
        .textContent = currentUser.first_name;

}


// ===========================
// Logout
// ===========================

function logout(){

    removeAccessToken();

    window.location.href = "../pages/login.html";

}

// Front End

async function loadHeader(){
const response = await fetch("../../layout/header.html");

const html = await response.text();

document
    .getElementById("header-container")
    .innerHTML = html;
}

async function loadSidebar(){
const response = await fetch("../../layout/sidebar.html");

const html = await response.text();

document
    .getElementById("sidebar-container")
    .innerHTML = html;
}

async function loadSidebar(role){

    const response = await fetch(
        `../../layout/${role}_sidebar.html`
    );

    const html = await response.text();

    document
        .getElementById("sidebar-container")
        .innerHTML = html;

}

async function initializeLayout(role){
    await loadHeader();
    await loadSidebar(role);
}