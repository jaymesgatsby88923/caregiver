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
                    <button onclick="updateActivity( ${activity.id}, '${activity.Name}' )"> Update </button>
                </div>
            `;
        });
    }

    loadActivities();
    
async function updateActivity(
        activityId,
        currentName
    ) {

        const newName = prompt(
            "Enter new activity name:",
            currentName
        );

        if (!newName) {
            return;
        }

        const response = await fetch(
            `http://127.0.0.1:8000/activities/${activityId}`,
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