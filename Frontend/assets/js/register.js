/*
==========================================================
CareApp Registration Page
----------------------------------------------------------
Handles:
- Reading form values
- Client-side validation
- Displaying validation errors
- Loading state
- Placeholder for backend registration
==========================================================
*/


// ===========================
// Form Elements
// ===========================

const registerForm = document.getElementById("register-form");

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const terms = document.getElementById("terms");

const registerButton = document.getElementById("register-button");

const messageContainer = document.getElementById("message-container");


// ===========================
// Event Listeners
// ===========================

registerForm.addEventListener("submit", registerUser);


// ===========================
// Main Registration Function
// ===========================

async function registerUser(event){

    event.preventDefault();

    clearErrors();

    clearMessage();

    if(!validateForm()){
        return;
    }


    setLoading(true);

    await signup()
    setLoading(false);

    /*
    ==========================================
    BACKEND CONNECTION GOES HERE

    This is where YOU will connect FastAPI.

    Example:

    const response = await fetch(...);

    ==========================================
    */
async function signup()
{       
    console.log("Started")
    const signupData = {
    first_name:firstName.value,
    last_name:lastName.value,
    email:email.value,
    password:password.value,
    role:"caregiver"
    };
        const response = await fetch(
            `http://127.0.0.1:8000/auth/signup`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(signupData)
            }
        )

        console.log("end")
    }



    showSuccess("Frontend validation passed! Ready to connect backend.");

    

}


// ===========================
// Validation
// ===========================

function validateForm(){

    let valid = true;

    if(firstName.value.trim() === ""){

        showFieldError("first-name-error","First name is required.");

        valid = false;

    }

    if(lastName.value.trim() === ""){

        showFieldError("last-name-error","Last name is required.");

        valid = false;

    }

    if(email.value.trim() === ""){

        showFieldError("email-error","Email is required.");

        valid = false;

    }

    else if(!isValidEmail(email.value)){

        showFieldError("email-error","Please enter a valid email.");

        valid = false;

    }

    if(password.value.length < 8){

        showFieldError("password-error","Password must be at least 8 characters.");

        valid = false;

    }

    if(password.value !== confirmPassword.value){

        showFieldError("confirm-password-error","Passwords do not match.");

        valid = false;

    }

    if(!terms.checked){

        showFieldError("terms-error","Please accept the Terms of Service.");

        valid = false;

    }

    return valid;

}


// ===========================
// Helpers
// ===========================

function isValidEmail(emailAddress){

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(emailAddress);

}


function showFieldError(elementId,message){

    document.getElementById(elementId).textContent = message;

}


function clearErrors(){

    const errors = document.querySelectorAll(".error-message");

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

    registerButton.disabled = isLoading;

    if(isLoading){

        registerButton.textContent = "Creating Account...";

    }

    else{

        registerButton.textContent = "Create Account";

    }

}