if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const meetingForm = document.getElementById("meetingForm");
const meetingTableBody = document.getElementById("meetingTableBody");
const meetingIdHiddenInput = document.getElementById("meetingId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const locationInput = document.getElementById("location");
const participantsInput = document.getElementById("participants");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/meetings";

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
  hideAlert();
  let isValid = true;
  let errors = [];

  if (!titleInput.value.trim()) {
    isValid = false;
    errors.push("Title is required.");
    titleInput.classList.add("input-error");
  } else {
    titleInput.classList.remove("input-error");
  }

  if (!dateInput.value.trim()) {
    isValid = false;
    errors.push("Date is required.");
    dateInput.classList.add("input-error");
  } else {
    dateInput.classList.remove("input-error");
  }

  if (!timeInput.value.trim()) {
    isValid = false;
    errors.push("Time is required.");
    timeInput.classList.add("input-error");
  } else {
    timeInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }
  return isValid;
}

// Load meetings from API
async function loadMeetings() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    meetingTableBody.innerHTML = "";
    data.forEach((meeting) => {
      meeting.id = meeting.$loki;
      const row = `
      <tr>
        <td>${meeting.title}</td>
        <td>${meeting.date}</td>
        <td>${meeting.time}</td>
        <td>${meeting.location}</td>
        <td>${meeting.participants}</td>
        <td>${meeting.status}</td>
        <td>
        <button onclick="editMeeting(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteMeeting(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      meetingTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load meetings.");
    console.error(error);
  }
}

// Create a New meeting via API
async function createMeeting() {
  if (!validateForm()) return;

  const newMeeting = {
    id: Date.now(),
    title: titleInput.value,
    description: descriptionInput.value,
    date: dateInput.value,
    time: timeInput.value,
    location: locationInput.value,
    participants: participantsInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newMeeting),
    });

    if (!response.ok) {
      throw new Error("Failed to create meeting.");
    }

    resetForm();
    loadMeetings();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing meeting via API
async function updateMeeting() {
  if (!validateForm()) return;

  const id = meetingIdHiddenInput.value;
  const updatedMeeting = {
    title: titleInput.value,
    description: descriptionInput.value,
    date: dateInput.value,
    time: timeInput.value,
    location: locationInput.value,
    participants: participantsInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedMeeting),
    });

    if (!response.ok) {
      throw new Error("Failed to update meeting.");
    }

    resetForm();
    loadMeetings();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}
// Delete meeting via API
async function deleteMeeting(id) {
  if (!confirm("Are you sure you want to delete this meeting?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete meeting.");
    }

    loadMeetings();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Meeting: Fetch Data by ID and Populate Form
async function editMeeting(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load meeting.");
    }

    const meeting = await response.json();
    meeting.id = meeting.$loki;

    meetingIdHiddenInput.value = meeting.id;
    titleInput.value = meeting.title;
    descriptionInput.value = meeting.description;
    dateInput.value = meeting.date;
    timeInput.value = meeting.time;
    locationInput.value = meeting.location;
    participantsInput.value = meeting.participants;
    statusInput.value = meeting.status;
    notesInput.value = meeting.notes || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  meetingIdHiddenInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  locationInput.value = "";
  participantsInput.value = "";
  statusInput.value = "";
  notesInput.value = "";

  titleInput.classList.remove("input-error");
  dateInput.classList.remove("input-error");
  timeInput.classList.remove("input-error");
}

// Form Submission Handler
meetingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (meetingIdHiddenInput.value) {
    updateMeeting();
  } else {
    createMeeting();
  }
});

// Initial Load
loadMeetings();
