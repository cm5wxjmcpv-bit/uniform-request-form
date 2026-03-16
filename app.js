const SCRIPT_URL = "PASTE_GOOGLE_SCRIPT_URL_HERE";

const form = document.getElementById("uniformForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function(e){
e.preventDefault();

const data = {
employeeName: document.getElementById("employeeName").value,
employeeEmail: document.getElementById("employeeEmail").value,
itemRequested: document.getElementById("itemRequested").value,
reasonForReplacement: document.getElementById("reasonForReplacement").value
};

try{

const res = await fetch(SCRIPT_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(data)
});

const result = await res.json();

if(result.success){
message.textContent = "Request submitted successfully.";
form.reset();
}else{
message.textContent = "Submission failed. Please try again.";
}

}catch(err){
message.textContent = "Submission failed. Please try again.";
}

});
