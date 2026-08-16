
const welcomeName = document.getElementById("welcome-name");

async function getActivities(){

    const token = localStorage.getItem("access_token");

    const response = await fetch(
        "http://127.0.0.1:8000/activities",
        {
            method:"GET",

            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
const data = await response.json()

return data
}

async function createActivity(activity){
  
    const token = localStorage.getItem("access_token")

    const response = await fetch(
        "http://127.0.0.1:8000/activities",
        {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:activity.name
            })
        }
    )
  
}

async function updateActivity(activity){
const token = localStorage.getItem("access_token")

    const response = await fetch(
        `http://127.0.0.1:8000/activities/${activity.id}`,
        {
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:activity.name,
                active:activity.active
            })
        }
    )
}


/*
==========================================================
CareApp Activities
----------------------------------------------------------
Handles:
- Loading activities
- Rendering activities
- Add/Edit modal
- Search
==========================================================
*/


// ==========================================================
// State
// ==========================================================

let activities = [];

let editingActivity = null;


// ==========================================================
// Elements
// ==========================================================

const activityList = document.getElementById("activity-list");

const searchInput = document.getElementById("search-input");

const totalActivities = document.getElementById("total-activities");
const activeActivities = document.getElementById("active-activities");
const inactiveActivities = document.getElementById("inactive-activities");

const emptyState = document.getElementById("empty-state");

const activityModal = document.getElementById("activity-modal");

const activityForm = document.getElementById("activity-form");

const activityId = document.getElementById("activity-id");

const activityName = document.getElementById("activity-name");

const activityDescription =
    document.getElementById("activity-description");

const modalTitle = document.getElementById("modal-title");

const addActivityButton =
    document.getElementById("add-activity-button");

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
    initializeActivities
);

searchInput.addEventListener(
    "input",
    renderActivities
);

addActivityButton.addEventListener(
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

activityForm.addEventListener(
    "submit",
    saveActivity
);


// ==========================================================
// Initialization
// ==========================================================

async function initializeActivities(){

    await initializeLayout("admin");

    await loadCurrentUser();

    await loadActivities();

}

/*
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

}*/
// ==========================================================
// Load Activities
// ==========================================================

async function loadActivities(){

    activities = await getActivities();

    renderActivities();

    updateSummary();

}

// ==========================================================
// Rendering
// ==========================================================

function renderActivities(){
    activityList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredActivities = activities.filter(activity =>
        activity.Name.toLowerCase().includes(searchText)
    );

    if(filteredActivities.length === 0){

        emptyState.classList.remove("hidden");

        return;

    }

    emptyState.classList.add("hidden");

    filteredActivities.forEach(activity => {

        const card = createActivityCard(activity);

        activityList.appendChild(card);

    });

}


// ==========================================================
// Activity Card
// ==========================================================

function createActivityCard(activity){

    const card = document.createElement("div");

    card.className = "activity-card card";


    // Header

    const header = document.createElement("div");

    header.className = "activity-card-header";


    const title = document.createElement("h3");

    title.textContent = activity.Name;


    const badge = document.createElement("span");

    badge.className = activity.active
        ? "status-badge active"
        : "status-badge inactive";

    badge.textContent = activity.active
        ? "Active"
        : "Inactive";


    header.appendChild(title);

    header.appendChild(badge);


    // Description

    const description = document.createElement("p");

    description.className = "activity-description";

    description.textContent =
        activity.description || "No description.";


    // Buttons

    const buttonContainer = document.createElement("div");

    buttonContainer.className = "activity-buttons";


    const editButton = document.createElement("button");

    editButton.className = "secondary-button";

    editButton.textContent = "Edit";


    editButton.addEventListener(
        "click",
        () => openEditModal(activity)
    );


    const activeButton = document.createElement("button");

    activeButton.className = activity.active
        ? "danger-button"
        : "primary-button";


    activeButton.textContent = activity.active
        ? "Deactivate"
        : "Activate";


    activeButton.addEventListener(
        "click",
        () => toggleActivity(activity)
    );


    buttonContainer.appendChild(editButton);

    buttonContainer.appendChild(activeButton);


    card.appendChild(header);

    card.appendChild(description);

    card.appendChild(buttonContainer);


    return card;

}


// ==========================================================
// Summary
// ==========================================================

function updateSummary(){

    totalActivities.textContent = activities.length;

    activeActivities.textContent =
        activities.filter(activity => activity.active).length;

    inactiveActivities.textContent =
        activities.filter(activity => !activity.active).length;

}

// ==========================================================
// Modal
// ==========================================================

function openAddModal(){

    editingActivity = null;

    modalTitle.textContent = "Add Activity";

    activityId.value = "";

    activityName.value = "";

    activityDescription.value = "";

    activityModal.classList.remove("hidden");

}


function openEditModal(activity){

    editingActivity = activity;

    modalTitle.textContent = "Edit Activity";

    activityId.value = activity.activity_id;

    activityName.value = activity.Name;

    //activityDescription.value = "activity.description";

    activityModal.classList.remove("hidden");

}


function closeModal(){
console.log("close function")
    activityModal.classList.add("hidden");

    activityForm.reset();

    editingActivity = null;

}



// ==========================================================
// Save Activity
// ==========================================================

async function saveActivity(event){

    event.preventDefault();

    if(editingActivity === null){
        activity={
            "name":activityName.value
        }
        await createActivity(
            activity
        );
    

    }

    else{
        
        activity={
            "id":activityId.value,
            "name":activityName.value
        }
        console.log(activity.active)
        await updateActivity(
            activity
        );

    }

    closeModal();

    await loadActivities();

}



// ==========================================================
// Toggle Active / Inactive
// ==========================================================

async function toggleActivity(activity){

activity={"active":!activity.active,
        "id":activity.activity_id,
        "name":activity.Name
        }
    await updateActivity(

        activity
    );

    await loadActivities();

}