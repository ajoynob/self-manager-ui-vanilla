if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const callForm = document.getElementById("callForm");
const callTableBody = document.getElementById("callTableBody");
const callIdHiddenInput = document.getElementById("call_Id");
const contact_idInput = document.getElementById("contact_id");
const call_dateInput = document.getElementById("call_date");
const call_timeInput = document.getElementById("call_time");
const call_purposeInput = document.getElementById("call_purpose");
const repeat_intervalInput = document.getElementById("repeat_interval");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/call_schedules";

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

// Handle Unauthorized (401)
function handle401() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "login.html";
}

// Global secure fetch with auth header + 401 check
async function secureFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
        handle401();
    }

    return response;
}

// Validation Function
function validateForm() {
  hideAlert(); // Clear previous alerts
  let isValid = true;
  let errors = [];

  if (!contact_idInput.value.trim()) {
    isValid = false;
    errors.push("Contact id is required.");
    contact_idInput.classList.add("input-error");
  } else {
    contact_idInput.classList.remove("input-error");
  }

  if (!call_timeInput.value.trim() || !/^\S+:\S+$/.test(call_timeInput.value)) {
    isValid = false;
    errors.push("Call time is required (format:(00:00:00 AM)).");
    call_timeInput.classList.add("input-error");
  } else {
    call_timeInput.classList.remove("input-error");
  }

  if (!call_dateInput.value.trim()) {
    isValid = false;
    errors.push("Call date is required (format: (dd/mm/yy)).");
    call_dateInput.classList.add("input-error");
  } else {
    call_dateInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load Call_Schedules from API
async function loadCalls() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    callTableBody.innerHTML = "";

    data.forEach((call) => {
      call.id = call.$loki;
      const row = `
      <tr>
        <td>${call.contact_id}</td>
        <td>${call.call_date}</td>
        <td>${call.call_time}</td>
        <td>${call.call_purpose}</td>
        <td>${call.repeat_interval}</td>
        <td>${call.status}</td>
        <td>
        <button onclick="editCall(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteCall(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      callTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load call schedule.");
    console.error(error);
  }
}

// Create a New Call_Schedule via API
async function createCall() {
  if (!validateForm()) return;

  const newCall = {
    id: Date.now(),
    contact_id: contact_idInput.value,
    call_date: call_dateInput.value,
    call_time: call_timeInput.value,
    call_purpose: call_purposeInput.value,
    repeat_interval: repeat_intervalInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newCall),
    });

    if (!response.ok) {
      throw new Error("Failed to create call schedule.");
    }

    resetForm();
    loadCalls();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing Call_Schedule via API
async function updateCall() {
  if (!validateForm()) return;

  const id = callIdHiddenInput.value;
  const updatedCalls = {
    contact_id: contact_idInput.value,
    call_date: call_dateInput.value,
    call_time: call_timeInput.value,
    call_purpose: call_purposeInput.value,
    repeat_interval: repeat_intervalInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };

  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCalls),
    });

    if (!response.ok) {
      throw new Error("Failed to update call schedule.");
    }

    resetForm();
    loadCalls();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete Call via API
async function deleteCall(id) {
  if (!confirm("Are you sure you want to delete this call schedule?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete call schedule.");
    }

    loadCalls();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Call Schedule: Fetch Data by ID and Populate Form
async function editCall(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load call schedule.");
    }

    const contact = await response.json();
    call.id = call.$loki;

    callIdHiddenInput.value = call.call_Id;
    contact_idInput.value = call.contact_id;
    call_dateInput.value = call.call_date;
    call_timeInput.value = call.call_time;
    call_purposeInput.value = call.call_purpose;
    repeat_intervalInput.value = call.repeat_interval || "";
    statusInput.value = call.status || "";
    notesInput.value = call.notes || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  callIdHiddenInput.value = "";
  contact_idInput.value = "";
  call_dateInput.value = "";
  call_timeInput.value = "";
  call_purposeInput.value = "";
  repeat_intervalInput.value = "Scheduled";
  statusInput.value = "None";
  notesInput.value = "";

  contact_idInput.classList.remove("input-error");
  call_dateInput.classList.remove("input-error");
  call_timeInput.classList.remove("input-error");
}

// Form Submission Handler
callForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (callIdHiddenInput.value) {
    updateCall();
  } else {
    createCall();
  }
});

// Initial Load
loadCalls();
