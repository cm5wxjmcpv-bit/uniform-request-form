diff --git a/app.js b/app.js
index 23abbd6d42f78b61b27feb6be08202302839bf4f..aca2145ad0fa38acc915f33172f798e837492282 100644
--- a/app.js
+++ b/app.js
@@ -11,69 +11,71 @@ document.addEventListener("DOMContentLoaded", () => {
     if (itemRequested.value === "Other") {
       otherItemWrap.style.display = "block";
       otherItem.required = true;
     } else {
       otherItemWrap.style.display = "none";
       otherItem.required = false;
       otherItem.value = "";
     }
   }
 
   itemRequested.addEventListener("change", toggleOtherField);
   toggleOtherField();
 
   form.addEventListener("submit", async (e) => {
     e.preventDefault();
 
     statusMessage.textContent = "Submitting...";
     statusMessage.style.color = "#333";
 
     const employeeName = document.getElementById("employeeName").value.trim();
     const employeeEmail = document.getElementById("employeeEmail").value.trim();
     const selectedItem = itemRequested.value;
     const otherItemValue = otherItem.value.trim();
     const finalItemRequested =
       selectedItem === "Other" ? otherItemValue : selectedItem;
+    const quantity = document.getElementById("quantity").value.trim();
     const size = document.getElementById("size").value.trim();
     const reason = document.getElementById("reason").value.trim();
 
-    if (!employeeName || !employeeEmail || !selectedItem || !size || !reason) {
+    if (!employeeName || !employeeEmail || !selectedItem || !quantity || !size || !reason) {
       statusMessage.textContent = "Please complete all required fields.";
       statusMessage.style.color = "red";
       return;
     }
 
     if (selectedItem === "Other" && !otherItemValue) {
       statusMessage.textContent = "Please enter the other item requested.";
       statusMessage.style.color = "red";
       return;
     }
 
     const formData = new URLSearchParams();
     formData.append("employeeName", employeeName);
     formData.append("employeeEmail", employeeEmail);
     formData.append("itemRequested", finalItemRequested);
+    formData.append("quantity", quantity);
     formData.append("size", size);
     formData.append("reason", reason);
 
     try {
       const response = await fetch(SCRIPT_URL, {
         method: "POST",
         body: formData
       });
 
       const text = await response.text();
       console.log("Raw server response:", text);
 
       let result;
       try {
         result = JSON.parse(text);
       } catch (parseError) {
         throw new Error("Could not parse server response: " + text);
       }
 
       if (result.ok) {
         statusMessage.textContent = "Request submitted successfully.";
         statusMessage.style.color = "green";
         form.reset();
         toggleOtherField();
       } else {
