/*
==========================================================
CareApp Login Page
----------------------------------------------------------
Handles:
- Reading form values
- Client-side validation
- Logging in
- Loading the authenticated user
- Redirecting based on role
==========================================================
*/


// ===========================
// Form Elements
// ===========================

const loginForm = document.getElementById("login-form");

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginButton = document.getElementById("login-button");

const messageContainer = document.getElementById("message-container");


// ===========================
// Event Listeners
// ===========================

loginForm.addEventListener("submit", handleLogin);


// ===========================
// Main Login Function
// ===========================

async function handleLogin(event){

    event.preventDefault();

    clearErrors();

    clearMessage();

    if(!validateForm()){
        return;
    }

    setLoading(true);

    await login();

    setLoading(false);

}


// ===========================
// Login Request
// ===========================

async function login(){

    const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }
    );

    if(!response.ok){

        showError("Invalid email or password.");

        return;

    }

    const data = await response.json();

    setAccessToken(data.access_token);

    await loadCurrentUser();

}


// ===========================
// Load Current User
// ===========================

async function loadCurrentUser(){

    const token = getAccessToken();

    const response = await fetch(
        "http://127.0.0.1:8000/auth/current-user",
        {
            method:"GET",

            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    );

    if(!response.ok){

        showError("Unable to load user information.");

        return;

    }

    const currentUser = await response.json();

    localStorage.setItem(
        "first_name",
        currentUser.first_name
    );

    redirectUser(currentUser.role);

}


// ===========================
// Redirect
// ===========================

function redirectUser(role){

    if(role === "admin"){

        window.location.href =
            "admin/admin_dashboard.html";

    }

    else if(role === "caregiver"){

        window.location.href =
            "caregiver/caregiver_dashboard.html";

    }

    else if(role === "client"){

        window.location.href =
            "client/client_dashboard.html";

    }

    else{

        showError("Unknown user role.");

    }

}


// ===========================
// Validation
// ===========================

function validateForm(){

    let valid = true;

    if(email.value.trim() === ""){

        showFieldError(
            "email-error",
            "Email is required."
        );

        valid = false;

    }

    if(password.value.trim() === ""){

        showFieldError(
            "password-error",
            "Password is required."
        );

        valid = false;

    }

    return valid;

}


// ===========================
// Helpers
// ===========================

function showFieldError(elementId,message){

    document.getElementById(elementId).textContent =
        message;

}


function clearErrors(){

    const errors =
        document.querySelectorAll(".error-message");

    errors.forEach(error => {

        error.textContent = "";

    });

}


function showSuccess(message){

    messageContainer.innerHTML =
        `<p class="success-message">${message}</p>`;

}


function showError(message){

    messageContainer.innerHTML =
        `<p class="error-message">${message}</p>`;

}


function clearMessage(){

    messageContainer.innerHTML = "";

}


function setLoading(isLoading){

    loginButton.disabled = isLoading;

    if(isLoading){

        loginButton.textContent = "Signing In...";

    }

    else{

        loginButton.textContent = "Sign In";

    }

}