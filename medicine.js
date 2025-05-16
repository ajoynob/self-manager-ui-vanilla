// medicine.js
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const medicineForm = document.getElementById("medicineForm");
const medicineTableBody = document.getElementById("medicineTableBody");
const medicineIdHiddenInput = document.getElementById("medicineId");
const nameInput = document.getElementById("name");
const dosageInput = document.getElementById("dosage");
const frequencyInput = document.getElementById("frequency");
const start_dateInput = document.getElementById("start_date");
const end_dateInput = document.getElementById("end_date");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/medicines";

// Display Alert
function showAlert(message) {
  alertMessage.innerText = message;
  alertBox.classList.remove("hidden");
}

// Hide Alert
function hideAlert() {
  alertBox.classList.add("hidden");
  alertMessage.innerText = "";
}

// Validation Function
function validateForm() {
  hideAlert();
  let isValid = true;
  let errors = [];

  if (!nameInput.value.trim()) {
    isValid = false;
    errors.push("Name is required.");
    nameInput.classList.add("input-error");
  } else {
    nameInput.classList.remove("input-error");
  }

  if (!dosageInput.value.trim()) {
    isValid = false;
    errors.push("Dosage is required.");
    dosageInput.classList.add("input-error");
  } else {
    dosageInput.classList.remove("input-error");
  }

  if (!statusInput.value.trim()) {
    isValid = false;
    errors.push("Status is required.");
    statusInput.classList.add("input-error");
  } else {
    statusInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load medicines from API
async function loadMedicines() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    medicineTableBody.innerHTML = "";
    data.forEach((medicine) => {
      medicine.id = medicine.$loki;
      const row = `
      <tr>
        <td>${medicine.name}</td>
        <td>${medicine.dosage}</td>
        <td>${medicine.frequency}</td>
        <td>${medicine.status}</td>
        <td>${medicine.start_date}</td>
        <td>${medicine.end_date}</td>
        <td>
        <button onclick="editMedicine(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteMedicine(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      medicineTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load medicines.");
    console.error(error);
  }
}

// Create a New medicine via API
async function createMedicine() {
  if (!validateForm()) return;

  const newMedicine = {
    id: Date.now(),
    name: nameInput.value,
    dosage: dosageInput.value,
    frequency: frequencyInput.value,
    start_date: start_dateInput.value,
    end_date: end_dateInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMedicine),
    });

    if (!response.ok) {
      throw new Error("Failed to create medicine.");
    }

    resetForm();
    loadMedicines();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing medicine via API
async function updateMedicine() {
  if (!validateForm()) return;

  const id = medicineIdHiddenInput.value;
  const updatedMedicine = {
    name: nameInput.value,
    dosage: dosageInput.value,
    frequency: frequencyInput.value,
    start_date: start_dateInput.value,
    end_date: end_dateInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMedicine),
    });

    if (!response.ok) {
      throw new Error("Failed to update medicine.");
    }

    resetForm();
    loadMedicines();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete medicine via API
async function deleteMedicine(id) {
  if (!confirm("Are you sure you want to delete this medicine?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete medicine.");
    }

    loadMedicines();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Medicine: Fetch Data by ID and Populate Form
async function editMedicine(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load medicine.");
    }

    const medicine = await response.json();
    medicine.id = medicine.$loki;

    medicineIdHiddenInput.value = medicine.id;
    nameInput.value = medicine.name;
    dosageInput.value = medicine.dosage;
    frequencyInput.value = medicine.frequency;
    start_dateInput.value = medicine.start_date;
    end_dateInput.value = medicine.end_date;
    statusInput.value = medicine.status;
    notesInput.value = medicine.notes || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  medicineIdHiddenInput.value = "";
  nameInput.value = "";
  dosageInput.value = "";
  frequencyInput.value = "";
  start_dateInput.value = "";
  end_dateInput.value = "";
  statusInput.value = "";
  notesInput.value = "";

  nameInput.classList.remove("input-error");
  dosageInput.classList.remove("input-error");
  statusInput.classList.remove("input-error");
}

// Form Submission Handler
medicineForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (medicineIdHiddenInput.value) {
    updateMedicine();
  } else {
    createMedicine();
  }
});

// Initial Load
loadMedicines();
