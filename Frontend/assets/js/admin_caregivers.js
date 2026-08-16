/*
==========================================================
CareApp Caregivers
----------------------------------------------------------
Handles:
- Loading caregivers
- Rendering caregivers
- Add/Edit modal
- Search
==========================================================
*/


// ==========================================================
// API
// ==========================================================

async function getCaregivers(){

    const token = getAccessToken();

    const response = await fetch(
        "http://127.0.0.1:8000/caregivers",
        {
            method: "GET",

            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const caregivers = await response.json();

    return caregivers;

}



async function createCaregiver(caregiver){

      const token = localStorage.getItem("access_token")

    const response = await fetch(
        "http://127.0.0.1:8000/caregivers",
        {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "first_name":caregiver.first_name,
                "last_name":caregiver.last_name,
                "rate":caregiver.rate,
                "phone":caregiver.phone,
                "email":caregiver.email,
                


            })
        }
    )

    closeModal();

    await loadCaregivers();

}


async function updateCaregiver(caregiver){

const token = localStorage.getItem("access_token")

    const response = await fetch(
        `http://127.0.0.1:8000/caregivers/${caregiver.caregiver_id}`,
        {
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "first_name":caregiver.first_name,
                "last_name":caregiver.last_name,
                "rate":caregiver.rate,
                "phone":caregiver.phone,
                "email":caregiver.email,
                "user_id":caregiver.user_id,
                "active":caregiver.active


            })
        }
    )

    closeModal();

    await loadCaregivers();

    
    

}


// ==========================================================
// State
// ==========================================================

let caregivers = [];

let editingCaregiver = null;


// ==========================================================
// Elements
// ==========================================================

const caregiverList =
    document.getElementById("caregiver-list");

const searchInput =
    document.getElementById("search-input");

const totalCaregivers =
    document.getElementById("total-caregivers");

const activeCaregivers =
    document.getElementById("active-caregivers");

const inactiveCaregivers =
    document.getElementById("inactive-caregivers");

const emptyState =
    document.getElementById("empty-state");


const caregiverModal =
    document.getElementById("caregiver-modal");

const caregiverForm =
    document.getElementById("caregiver-form");

const caregiverId =
    document.getElementById("caregiver-id");

const caregiverFirstName =
    document.getElementById("caregiver-first-name");

const caregiverLastName =
    document.getElementById("caregiver-last-name");

const caregiverEmail =
    document.getElementById("caregiver-email");

const caregiverPhone =
    document.getElementById("caregiver-phone");

const caregiverRate =
    document.getElementById("caregiver-rate");


const modalTitle =
    document.getElementById("modal-title");

const addCaregiverButton =
    document.getElementById("add-caregiver-button");

const emptyAddButton =
    document.getElementById("empty-add-button");

const cancelButton =
    document.getElementById("cancel-button");

const closeModalButton =
    document.getElementById("close-modal-button");


// ==========================================================
// Event Listeners
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeCaregivers
);

searchInput.addEventListener(
    "input",
    renderCaregivers
);

addCaregiverButton.addEventListener(
    "click",
    openAddModal
);

emptyAddButton.addEventListener(
    "click",
    openAddModal
);

cancelButton.addEventListener(
    "click",
    closeModal
);

closeModalButton.addEventListener(
    "click",
    closeModal
);

caregiverForm.addEventListener(
    "submit",
    saveCaregiver
);


// ==========================================================
// Initialization
// ==========================================================

async function initializeCaregivers(){

    await initializeLayout("admin");

    await loadCurrentUser();

    await loadCaregivers();

}


// ==========================================================
// Load Caregivers
// ==========================================================

async function loadCaregivers(){

    caregivers = await getCaregivers();

    renderCaregivers();

    updateSummary();

}


// ==========================================================
// Rendering
// ==========================================================

function renderCaregivers(){
    
   caregiverList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

const filteredCaregivers = caregivers.filter(caregiver =>
    caregiver.first_name.toLowerCase().includes(searchText) ||
    caregiver.last_name.toLowerCase().includes(searchText)
);


    if(filteredCaregivers.length === 0){

        emptyState.classList.remove("hidden");

        

        return;

}

filteredCaregivers.forEach(caregiver => {

        const card = createCaregiverCard(caregiver);

        caregiverList.appendChild(card);
})
}



// ==========================================================
// Caregiver Card
// ==========================================================

function createCaregiverCard(caregiver){

    const card = document.createElement("div");

    card.className = "caregiver-card card";


    // ==========================================================
    // Header
    // ==========================================================

    const header = document.createElement("div");

    header.className = "caregiver-card-header";


    const title = document.createElement("h3");

    title.textContent =
        `${caregiver.first_name} ${caregiver.last_name}`;


    const badge = document.createElement("span");

    badge.className = caregiver.active
        ? "status-badge active"
        : "status-badge inactive";

    badge.textContent = caregiver.active
        ? "Active"
        : "Inactive";


    header.appendChild(title);

    header.appendChild(badge);


    // ==========================================================
    // Details
    // ==========================================================

    const email = document.createElement("p");

    email.className = "caregiver-detail";

    email.innerHTML =
        `<strong>Email:</strong> ${caregiver.email}`;


    const phone = document.createElement("p");

    phone.className = "caregiver-detail";

    phone.innerHTML =
        `<strong>Phone:</strong> ${caregiver.phone ?? "Not Provided"}`;


    const rate = document.createElement("p");

    rate.className = "caregiver-detail";

    rate.innerHTML =
        `<strong>Rate:</strong> $${caregiver.rate}/hr`;


    // ==========================================================
    // Buttons
    // ==========================================================

    const buttonContainer = document.createElement("div");

    buttonContainer.className = "caregiver-buttons";


    const editButton = document.createElement("button");

    editButton.className = "secondary-button";

    editButton.textContent = "Edit";


    editButton.addEventListener(
        "click",
        () => openEditModal(caregiver)
    );


    const activeButton = document.createElement("button");

    activeButton.className = caregiver.active
        ? "danger-button"
        : "primary-button";


    activeButton.textContent = caregiver.active
        ? "Deactivate"
        : "Activate";


    activeButton.addEventListener(
        "click",
        () => toggleCaregiver(caregiver)
    );


    buttonContainer.appendChild(editButton);

    buttonContainer.appendChild(activeButton);


    // ==========================================================
    // Build Card
    // ==========================================================

    card.appendChild(header);

    card.appendChild(email);

    card.appendChild(phone);

    card.appendChild(rate);

    card.appendChild(buttonContainer);


    return card;

}


// ==========================================================
// Summary
// ==========================================================

function updateSummary(){

    totalCaregivers.textContent =
        caregivers.length;

    activeCaregivers.textContent =
        caregivers.filter(
            caregiver => caregiver.active
        ).length;

    inactiveCaregivers.textContent =
        caregivers.filter(
            caregiver => !caregiver.active
        ).length;

}


// ==========================================================
// Modal
// ==========================================================

function openAddModal(){

    editingCaregiver = null;

    modalTitle.textContent =
        "Add Caregiver";

    caregiverForm.reset();

    caregiverModal.classList.remove(
        "hidden"
    );

}


function openEditModal(caregiver){
    editingCaregiver = caregiver;


    modalTitle.textContent =
        "Edit Caregiver";

    caregiverId.value =
        caregiver.caregiver_id;

    caregiverFirstName.value =
        caregiver.first_name;

    caregiverLastName.value =
        caregiver.last_name;

    caregiverEmail.value =
        caregiver.email;

    caregiverPhone.value =
        caregiver.phone;

    caregiverRate.value =
        caregiver.rate;

    caregiverModal.classList.remove(
        "hidden"
    );

}


function closeModal(){

    caregiverModal.classList.add(
        "hidden"
    );

    caregiverForm.reset();

    editingCaregiver = null;

}


// ==========================================================
// Save
// ==========================================================

async function saveCaregiver(event){

    event.preventDefault();



if(editingCaregiver === null){
     caregiver={
        "first_name":caregiverFirstName.value,
        "last_name":caregiverLastName.value,
        "email":caregiverEmail.value,
        "phone":caregiverPhone.value,
        "rate":caregiverRate.value
        }
    await createCaregiver(caregiver);
        
    }

    else{
       
        caregiver={
        "first_name":caregiverFirstName.value,
        "last_name":caregiverLastName.value,
        "email":caregiverEmail.value,
        "phone":caregiverPhone.value,
        "rate":caregiverRate.value,
       "user_id":editingCaregiver.user_id,
         "caregiver_id":editingCaregiver.caregiver_id,
         "active":editingCaregiver.active

        }
        
        await updateCaregiver(caregiver);
        console.log("TEST")

    }


}


// ==========================================================
// Toggle Active
// ==========================================================

async function toggleCaregiver(caregiver){
 console.log(caregiver)
    caregiver.active=!caregiver.active;

    await updateCaregiver(caregiver)

    await loadCaregivers()
}