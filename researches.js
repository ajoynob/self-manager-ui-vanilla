if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const researchForm = document.getElementById("researchForm");
const researchTableBody = document.getElementById("researchTableBody");
const researchIdHiddenInput = document.getElementById("researchId");
const titleInput = document.getElementById("title");
const fieldInput = document.getElementById("field");
const descriptionInput = document.getElementById("description");
const start_dateInput = document.getElementById("start_date");
const end_dateInput = document.getElementById("end_date");
const statusInput = document.getElementById("status");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/researches";

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
    errors.push("title is required.");
    titleInput.classList.add("input-error");
  } else {
    titleInput.classList.remove("input-error");
  }

  if (!fieldInput.value.trim()) {
    isValid = false;
    errors.push("Field is required.");
    fieldInput.classList.add("input-error");
  } else {
    fieldInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load researchs from API
async function loadResearches() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    researchTableBody.innerHTML = "";
    data.forEach((research) => {
      research.id = research.$loki;
      const row = `
      <tr>
        <td>${research.title}</td>
        <td>${research.field}</td>
        <td>${research.start_date}</td>        
        <td>${research.end_date}</td>
        <td>${research.status}</td>
        <td>
        <button onclick="editResearch(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteResearch(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      researchTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load groceries.");
    console.error(error);
  }
}

// Create a New research via API
async function createResearch() {
  if (!validateForm()) return;

  const newResearch = {
    id: Date.now(),
    title: titleInput.value,
    field: fieldInput.value,
    description: descriptionInput.value,
    start_date: start_dateInput.value,
    end_date: end_dateInput.value,
    status: statusInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newResearch),
    });

    if (!response.ok) {
      throw new Error("Failed to create researches.");
    }

    resetForm();
    loadResearches();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing research via API
async function updateResearch() {
  if (!validateForm()) return;

  const id = researchIdHiddenInput.value;
  const updatedResearch = {
    title: titleInput.value,
    field: fieldInput.value,
    description: descriptionInput.value,
    start_date: start_dateInput.value,
    end_date: end_dateInput.value,
    status: statusInput.value,
  };
  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedResearch),
    });

    if (!response.ok) {
      throw new Error("Failed to update researches.");
    }

    resetForm();
    loadResearches();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete research via API
async function deleteResearch(id) {
  if (!confirm("Are you sure you want to delete this research?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete research.");
    }

    loadResearches();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Researches: Fetch Data by ID and Populate Form
async function editResearch(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load research.");
    }

    const research = await response.json();
    research.id = research.$loki;

    researchIdHiddenInput.value = research.id;
    titleInput.value = research.title;
    fieldInput.value = research.field;
    descriptionInput.value = research.description;
    start_dateInput.value = research.start_date;
    end_dateInput.value = research.end_date;
    statusInput.value = research.status;
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  researchIdHiddenInput.value = "";
  titleInput.value = "";
  fieldInput.value = "";
  descriptionInput.value = "";
  start_dateInput.value = "";
  end_dateInput.value = "";
  statusInput.value = "";

  titleInput.classList.remove("input-error");
  fieldInput.classList.remove("input-error");
}

// Form Submission Handler
researchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (researchIdHiddenInput.value) {
    updateResearch();
  } else {
    createResearch();
  }
});

// Initial Load
loadResearches();
