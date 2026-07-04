 let manageActivityId = null;
let manageActivityName = ""

 async function loadActivities() {

        const response = await fetch(
            "http://127.0.0.1:8000/activities"
        );

        const activities = await response.json();

        const container =
            document.getElementById("activities");

        container.innerHTML = "";

        activities.forEach(activity => {

            container.innerHTML += `
                <div>
                    ${activity.Name}
                    <button onclick="manageActivity( '${activity.activity_id}', '${activity.Name}' )"> Manage </button>
                </div>
            `;
        
        });
    }

    loadActivities();


    
async function manageActivity(
        activityId,
        currentName
    ) {

        manageActivityId= activityId;
        manageActivityName = currentName;
        manageHeader = document.getElementById("manageTitle");
        manageHeader.innerHTML=`Manage: ${manageActivityName}`
        ManagePanel=document.getElementById("manageActivityPanel");
        ManagePanel.hidden= false
    }

async function deleteActivity(){

if (confirm(`Do you want to delete: ${manageActivityName}`) == true){
    console.log("True Path")
      const response = await fetch(
            `http://127.0.0.1:8000/activities/${manageActivityId}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    Name: manageActivityName
                })
            }
        );

    manageActivityId = null;
    manageActivityName=""
    ManagePanel=document.getElementById("manageActivityPanel");
    ManagePanel.hidden= true;
    loadActivities();

    }
else{
   manageActivityId = null;
    manageActivityName=""
    ManagePanel=document.getElementById("manageActivityPanel");
    ManagePanel.hidden= true;
} 



}
    
async function updateActivity(){
  
    const newName = prompt(
    "Enter new activity name:",
    manageActivityName
        );


        if (!newName) {
            return;
        }

        const response = await fetch(
            `http://127.0.0.1:8000/activities/${manageActivityId}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    Name: newName
                })
            }
        );

        if (response.ok) {

            alert("Updated!");

            loadActivities();
            console.log("success")
            manageActivityId = null;
            manageActivityName=""
            ManagePanel=document.getElementById("manageActivityPanel");
            ManagePanel.hidden= true;
        } else {

            alert("Update failed");
            console.log("failed");

        }

     
    }



       

async function addActivity(activityName)
{

     const input =
            document.getElementById("activityName");

        newActivity=input.value;

        JSON.stringify({
                    Name: newActivity
                })
        
        const response = await fetch(
            `http://127.0.0.1:8000/activities`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    Name: newActivity
                })
            }
        )
        input.value = "";
        loadActivities();
    }