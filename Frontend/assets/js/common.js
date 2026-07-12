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


// ===========================
// Logout
// ===========================

function logout(){

    removeAccessToken();

    window.location.href = "../pages/login.html";

}