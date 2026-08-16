

/*
==========================================================
CareApp Clients
----------------------------------------------------------
Handles:
- Loading clients
- Rendering clients
- Add/Edit modal
- Search
==========================================================
*/


// ==========================================================
// API
// ==========================================================

async function getCareTeam(client){
console.log("getCareTeam called with:", client);
 const token = getAccessToken();

    const response = await fetch(
        `http://127.0.0.1:8000/careteam/${client.client_id}`,
        {
            method: "GET",

            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const clients = await response.json();
    console.log("api"+clients)    
    return clients;


}


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

async function getClients(){

    const token = getAccessToken();

    const response = await fetch(
        "http://127.0.0.1:8000/clients",
        {
            method: "GET",

            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const clients = await response.json();

    return clients;

}


async function createClient(client){

      const token = localStorage.getItem("access_token")

    const response = await fetch(
        "http://127.0.0.1:8000/clients",
        {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
        "first_name": client.first_name,
        "last_name":client.last_name,
        "billing_rate":client.billing_rate,
        "phone":client.phone,
        "email":client.email,
        "address":client.address,
        "notes":client.notes


            })
        }
    )

    closeModal();

    await loadClients();

}


async function updateClient(client){

const token = localStorage.getItem("access_token")

    const response = await fetch(
        `http://127.0.0.1:8000/clients/${client.client_id}`,
        {
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "first_name":client.first_name,
                "last_name":client.last_name,
                "billing_rate":client.rate,
                "phone":client.phone,
                "email":client.email,
                "billing_rate":client.billing_rate,
                "active":client.active,
                "address":client.address,
                "notes":client.notes


            })
        }
    )

    closeModal();

    await loadClients();

    
    

}


// ==========================================================
// State
// ==========================================================

let clients = [];

let editingClient = null;


// ==========================================================
// Elements
// ==========================================================

const clientList =
    document.getElementById("client-list");

const searchInput =
    document.getElementById("search-input");

const totalClients =
    document.getElementById("total-clients");

const activeClients =
    document.getElementById("active-clients");

const inactiveClients =
    document.getElementById("inactive-clients");

const emptyState =
    document.getElementById("empty-state");

const clientModal =
    document.getElementById("client-modal");

const clientForm =
    document.getElementById("client-form");

const clientId =
    document.getElementById("client-id");

const clientFirstName =
    document.getElementById("client-first-name");

const clientLastName =
    document.getElementById("client-last-name");

const clientEmail =
    document.getElementById("client-email");

const clientPhone =
    document.getElementById("client-phone");

const clientAddress =
    document.getElementById("client-address");

const clientBillingRate =
    document.getElementById("client-billing-rate");

const clientNotes =
    document.getElementById("client-notes");

const modalTitle =
    document.getElementById("modal-title");

const addClientButton =
    document.getElementById("add-client-button");

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
    initializeClients
);

searchInput.addEventListener(
    "input",
    renderClients
);

addClientButton.addEventListener(
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

clientForm.addEventListener(
    "submit",
    saveClient
);

document
    .getElementById("close-care-team-button")
    .addEventListener(
        "click",
        closeCareTeamModal
    );

document
    .getElementById("close-care-team-footer-button")
    .addEventListener(
        "click",
        closeCareTeamModal
    );

document
    .querySelector("#care-team-modal .modal-overlay")
    .addEventListener(
        "click",
        closeCareTeamModal
    );

// ==========================================================
// Initialization
// ==========================================================

async function initializeClients(){
    await initializeLayout("admin");
    await loadCurrentUser();
    await loadClients();
}


// ==========================================================
// Load Clients
// ==========================================================

async function loadClients(){

    clients = await getClients();

    renderClients();

    updateSummary();

}


// ==========================================================
// Rendering
// ==========================================================

function renderClients(){
    
   clientList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

const filteredClients = clients.filter(client =>
    client.first_name.toLowerCase().includes(searchText) ||
    client.last_name.toLowerCase().includes(searchText)
);


    if(filteredClients.length === 0){

        emptyState.classList.remove("hidden");

        

        return;

}

filteredClients.forEach(client => {

        const card = createClientCard(client);

        clientList.appendChild(card);
})
}



// ==========================================================
// Client Card
// ==========================================================

function createClientCard(client){

    const card = document.createElement("div");

    card.className = "client-card card";


    // ==========================================================
    // Header
    // ==========================================================

    const header = document.createElement("div");

    header.className = "client-card-header";


    const title = document.createElement("h3");

    title.textContent =
        `${client.first_name} ${client.last_name}`;


    const badge = document.createElement("span");

    badge.className = client.active
        ? "status-badge active"
        : "status-badge inactive";

    badge.textContent = client.active
        ? "Active"
        : "Inactive";


    header.appendChild(title);

    header.appendChild(badge);


    // ==========================================================
    // Details
    // ==========================================================

    const email = document.createElement("p");

    email.className = "client-detail";

    email.innerHTML =
        `<strong>Email:</strong> ${client.email}`;


    const phone = document.createElement("p");

    phone.className = "client-detail";

    phone.innerHTML =
        `<strong>Phone:</strong> ${client.phone ?? "Not Provided"}`;


    const rate = document.createElement("p");

    rate.className = "client-detail";

    rate.innerHTML =
        `<strong>Rate:</strong> $${client.billing_rate}/hr`;


    // ==========================================================
    // Buttons
    // ==========================================================

    const buttonContainer = document.createElement("div");

buttonContainer.className = "client-buttons";


// ===========================
// Care Team Button
// ===========================

const careTeamButton = document.createElement("button");

careTeamButton.className = "care-team-button";

careTeamButton.textContent = "Care Team";

careTeamButton.addEventListener(
    "click",
    () => openCareTeamModal(client)
);


// ===========================
// Edit Button
// ===========================

const editButton = document.createElement("button");

editButton.className = "secondary-button";

editButton.textContent = "Edit";

editButton.addEventListener(
    "click",
    () => openEditModal(client)
);


// ===========================
// Activate / Deactivate
// ===========================

const activeButton = document.createElement("button");

activeButton.className = client.active
    ? "danger-button"
    : "primary-button";

activeButton.textContent = client.active
    ? "Deactivate"
    : "Activate";

activeButton.addEventListener(
    "click",
    () => toggleClient(client)
);


// ===========================
// Add Buttons
// ===========================

buttonContainer.appendChild(careTeamButton);

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

    totalClients.textContent =
        clients.length;

    activeClients.textContent =
        clients.filter(
            client => client.active
        ).length;

    inactiveClients.textContent =
        clients.filter(
            client => !client.active
        ).length;

}


// ==========================================================
// Modal
// ==========================================================
async function openCareTeamModal(client){

    // Store the client ID
    document.getElementById("care-team-client-id").value = client.client_id;

    // Load the current care team
   await getCareTeam(client);

    // Clear any previous search
    document.getElementById("caregiver-available").value = "";

    document.getElementById("caregiver-available").innerHTML = "";

    // Show the modal

    document
        .getElementById("care-team-modal")
        .classList
        .remove("hidden");
    await loadCareTeam(client);
    await loadCaregivers(client);

}

async function loadCaregivers(client) {

    const caregivers = await getCaregivers();
    const careTeam = await getCareTeam(client);

    const container = document.getElementById("caregiver-available-results");
    container.innerHTML = "";

    const availableCaregivers = caregivers.filter(caregiver =>
    !careTeam.some(assignment =>
        assignment.caregiver_id === caregiver.caregiver_id
    )
);

    availableCaregivers.forEach(caregiver => {

        const row = document.createElement("div");

        row.innerHTML = `
            <span>
                ${caregiver.first_name}
                ${caregiver.last_name}
            </span>
        `;

        container.appendChild(row);

    });
}

async function loadCareTeam(client) {

     console.log("Loading modal for", client);

    const careTeam = await getCareTeam(client);

    const container = document.getElementById("current-care-team");
    container.innerHTML = "";

    careTeam.forEach(assignment => {

    const row = document.createElement("div");

    row.innerHTML = `
        <span>
            ${assignment.Caregivers.Users.first_name}
            ${assignment.Caregivers.Users.last_name}
        </span>
    `;

    container.appendChild(row);

});
}

function closeCareTeamModal(){

    document
        .getElementById("care-team-modal")
        .classList
        .add("hidden");

}



function openAddModal(){

    editingClient = null;

    modalTitle.textContent =
        "Add Client";

    clientForm.reset();

    clientModal.classList.remove(
        "hidden"
    );

}


function openEditModal(client){
    editingClient = client;


    modalTitle.textContent =
        "Edit Client";

    clientId.value =
        client.client_id;

    clientFirstName.value =
        client.first_name;

    clientLastName.value =
        client.last_name;

    clientEmail.value =
        client.email;

    clientPhone.value =
        client.phone;

    clientBillingRate.value =
        client.billing_rate;
    
    clientNotes.value=
    client.notes

    clientAddress.value=
    client.address

    clientModal.classList.remove(
        "hidden"
    );

}


function closeModal(){

    clientModal.classList.add(
        "hidden"
    );

    clientForm.reset();

    editingClient = null;

}


// ==========================================================
// Save
// ==========================================================

async function saveClient(event){

    event.preventDefault();



if(editingClient === null){
     client={
        "first_name":clientFirstName.value,
        "last_name":clientLastName.value,
        "email":clientEmail.value,
        "phone":clientPhone.value,
        "billing_rate":clientBillingRate.value,
        "address":clientAddress.value,
        "notes":clientNotes.value
        }
    await createClient(client);
        
    }

    else{
       
        client={
        "first_name":clientFirstName.value,
        "last_name":clientLastName.value,
        "email":clientEmail.value,
        "phone":clientPhone.value,
        "billing_rate":clientBillingRate.value,
         "client_id":editingClient.client_id,
         "active":editingClient.active,
        "address":clientAddress.value,
        "notes":clientNotes.value
         

        }
        
        await updateClient(client);
        

    }


}


// ==========================================================
// Toggle Active
// ==========================================================

async function toggleClient(client){

    client.active=!client.active;

    await updateClient(client)

    await loadClients()
}