let caregivers= [];
let selectedCaregiver= ""

 async function loadCaregivers() {

        const response = await fetch(
            "http://127.0.0.1:8000/caregivers"
        );

        caregivers = await response.json();


        const container =
            document.getElementById("caregivers");

        container.innerHTML = "";

        caregivers.forEach(caregiver => {
           
            container.innerHTML += `
                <div>
                    ${caregiver.fName} ${caregiver.lName}
                    <button onclick="manageCaregiver( '${caregiver.caregiver_id}' )"> Manage </button>
                </div>
            `;
        
        });
    }

    loadCaregivers();


    
async function manageCaregiver(
        caregiverId
    ) {

       selectedCaregiver = caregivers.find(function(caregiver) {
       return caregiver.caregiver_id === caregiverId;
});
       
        manageHeader = document.getElementById("manageTitle");
        manageHeader.innerHTML=`Manage: ${selectedCaregiver.fName}`
        ManageCaregiverPanel=document.getElementById("manageCaregiverPanel");
        ManageCaregiverPanel.hidden= false;
    }

async function deleteCaregiver(){

if (confirm(`Do you want to delete: ${selectedCaregiver.fName} ${selectedCaregiver.lName}`) == true){
    console.log("True Path")
      const response = await fetch(
            `http://127.0.0.1:8000/caregivers/${selectedCaregiver.caregiver_id}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                   
                })
            }
        );

    /*manageActivityId = null;
    manageActivityName=""
    ManagePanel=document.getElementById("manageActivityPanel");
    ManagePanel.hidden= true;
    loadCaregivers();

    }
else{
   manageActivityId = null;
    manageActivityName=""
    ManageCaregiverPanel=document.getElementById("manageActivityPanel");
    ManageCaregiverPanel.hidden= true;
    */
} 
loadCaregivers();


}
    
function updateCaregiverForm(){

caregiverForm=document.getElementById("caregiverForm");
caregiverForm.hidden=false
const updateButton=document.getElementById("updateButton")
console.log(updateButton)
updateButton.hidden=false
fName=document.getElementById("fName")
fName.value=selectedCaregiver.fName
lName=document.getElementById("lName")
lName.value=selectedCaregiver.lName
rate=document.getElementById("rate")
rate.value=selectedCaregiver.rate
phone=document.getElementById("phone")
phone.value=selectedCaregiver.phone
email=document.getElementById("email")
email.value=selectedCaregiver.email
}

async function updateCaregiver() {
  
    fName=document.getElementById("fName")
    lName=document.getElementById("lName")
    rate=document.getElementById("rate")
    phone=document.getElementById("phone")
    email=document.getElementById("email")

        const response = await fetch(
            `http://127.0.0.1:8000/caregivers/${selectedCaregiver.caregiver_id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    "fName": fName.value,
                    "lName": lName.value,
                    "rate" : rate.value,
                    "phone": phone.value,
                    "email": email.value
                })
            }
        );

        if (response.ok) {

            alert("Updated!");

            loadCaregivers();
            console.log("success")
            ManagePanel=document.getElementById("manageCaregiverPanel");
            ManagePanel.hidden= true;
        } else {

            alert("Update failed");
            console.log("failed");

        }
    }
   
    



 function addCaregiverForm(){
caregiverForm=document.getElementById("caregiverForm");
caregiverForm.hidden=false
saveButton=document.getElementById("saveButton");
saveButton.hidden=false

 }    

async function addCaregiver()
{

fName=document.getElementById("fName")
lName=document.getElementById("lName")
rate=document.getElementById("rate")
phone=document.getElementById("phone")
email=document.getElementById("email")


      
        const response = await fetch(
            `http://127.0.0.1:8000/caregivers`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    "fName": fName.value,
                    "lName": lName.value,
                    "rate" : rate.value,
                    "phone": phone.value,
                    "email": email.value
                })
            }
        )
       
        loadCaregivers();
    }