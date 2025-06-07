if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const photoForm = document.getElementById("photoForm");
const photoTableBody = document.getElementById("photoTableBody");
const photoIdHiddenInput = document.getElementById("photoId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const urlInput = document.getElementById("url");
const uploaded_byInput = document.getElementById("uploaded_by");
const upload_dateInput = document.getElementById("upload_date");
const albumInput = document.getElementById("album");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/photos";

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

  if (!urlInput.value.trim()) {
    isValid = false;
    errors.push("Valid url is required.");
    urlInput.classList.add("input-error");
  } else {
    urlInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load photos from API
async function loadPhotos() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    photoTableBody.innerHTML = "";
    data.forEach((photo) => {
      photo.id = photo.$loki;
      const row = `
      <tr>
        <td>${photo.title}</td>
        <td>${photo.description}</td>
        <td>${photo.url}</td>
        <td>${photo.upload_date}</td>
        <td>${photo.album}</td>
        <td>
        <button onclick="editPhoto(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deletePhoto(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      photoTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load groceries.");
    console.error(error);
  }
}

// Create a New photo via API
async function createPhoto() {
  if (!validateForm()) return;

  const newPhoto = {
    id: Date.now(),
    title: titleInput.value,
    description: descriptionInput.value,
    url: urlInput.value,
    uploaded_by: uploaded_byInput.value,
    upload_date: upload_dateInput.value,
    album: albumInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newPhoto),
    });

    if (!response.ok) {
      throw new Error("Failed to create photos.");
    }

    resetForm();
    loadPhotos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing photo via API
async function updatePhoto() {
  if (!validateForm()) return;

  const id = photoIdHiddenInput.value;
  const updatedPhoto = {
    title: titleInput.value,
    description: descriptionInput.value,
    url: urlInput.value,
    uploaded_by: uploaded_byInput.value,
    upload_date: upload_dateInput.value,
    album: albumInput.value,
  };
  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedPhoto),
    });

    if (!response.ok) {
      throw new Error("Failed to update photos.");
    }

    resetForm();
    loadPhotos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete photo via API
async function deletePhoto(id) {
  if (!confirm("Are you sure you want to delete this photo?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete photo.");
    }

    loadPhotos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Photo: Fetch Data by ID and Populate Form
async function editPhoto(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load photo.");
    }

    const photo = await response.json();
    photo.id = photo.$loki;

    photoIdHiddenInput.value = photo.id;
    titleInput.value = photo.title;
    descriptionInput.value = photo.description;
    urlInput.value = photo.url;
    uploaded_byInput.value = photo.uploaded_by;
    upload_dateInput.value = photo.upload_date;
    albumInput.value = photo.album;
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  photoIdHiddenInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  urlInput.value = "";
  uploaded_byInput.value = "";
  upload_dateInput.value = "";
  albumInput.value = "";

  urlInput.classList.remove("input-error");
}

// Form Submission Handler
photoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (photoIdHiddenInput.value) {
    updatePhoto();
  } else {
    createPhoto();
  }
});

// Initial Load
loadPhotos();
