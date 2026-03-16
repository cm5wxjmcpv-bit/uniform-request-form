const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzi5Bl4Rhpfd3O_0WkELPPWFdEQ-CwsI2Fu4qep6AyArgWwi23aWKtR-C7DDsm8uLmiYw/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uniformForm");
  const itemRequested = document.getElementById("itemRequested");
  const otherItemWrap = document.getElementById("otherItemWrap");
  const otherItem = document.getElementById("otherItem");
  const statusMessage = document.getElementById("statusMessage");

  function toggleOtherField() {
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
    const size = document.getElementById("size").value.trim();
    const reason = document.getElementById("reason").value.trim();

    if (!employeeName || !employeeEmail || !selectedItem || !size || !reason) {
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
        throw new Error(result.error || "Unknown server error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      statusMessage.textContent = "Submission failed. Please try again.";
      statusMessage.style.color = "red";
    }
  });
});
