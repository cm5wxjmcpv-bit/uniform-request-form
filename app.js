const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxr83x17dJnn5AhkYOiBRC-dAZ-czzVYN8cC4OVVgbi-Oz7pgJQ_8Gk8Vq3voZUrKGVmg/exec";

const form = document.getElementById("uniformForm");
const message = document.getElementById("message");
const itemSelect = document.getElementById("itemRequested");
const otherItemContainer = document.getElementById("otherItemContainer");
const otherItemInput = document.getElementById("otherItem");

itemSelect.addEventListener("change", function () {
  if (this.value === "Other") {
    otherItemContainer.classList.remove("hidden");
    otherItemInput.required = true;
  } else {
    otherItemContainer.classList.add("hidden");
    otherItemInput.required = false;
    otherItemInput.value = "";
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  message.textContent = "";

  let item = itemSelect.value;

  if (item === "Other") {
    item = otherItemInput.value.trim();
  }

  const data = {
    employeeName: document.getElementById("employeeName").value.trim(),
    employeeEmail: document.getElementById("employeeEmail").value.trim(),
    itemRequested: item,
    itemSize: document.getElementById("itemSize").value.trim(),
    reasonForReplacement: document
      .getElementById("reasonForReplacement")
      .value.trim()
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      message.textContent = "Request submitted successfully.";
      form.reset();
      otherItemContainer.classList.add("hidden");
      otherItemInput.required = false;
    } else {
      message.textContent = "Submission failed. Please try again.";
    }
  } catch (err) {
    message.textContent = "Submission failed. Please try again.";
  }
});
