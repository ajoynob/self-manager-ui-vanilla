// photo.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const photoForm = document.getElementById('photoForm');
const photoTableBody = document.getElementById('photoTableBody');
const photoIdHiddenInput = document.getElementById('photoId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const urlInput = document.getElementById('url');
const uploaded_byInput = document.getElementById('uploaded_by');
const upload_dateInput = document.getElementById('upload_date');
const albumInput = document.getElementById('album')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let photos = [];

// Display Alert
function showAlert(message) {
    alertMessage.innerText = message;
    alertBox.classList.remove('hidden');
}

// Hide Alert
function hideAlert() {
    alertBox.classList.add('hidden');
    alertMessage.innerText = '';
}

// Validation Function
function validateForm() {
    hideAlert(); // Clear previous alerts
    let isValid = true;
    let errors = [];

    // url is required
    if (!urlInput.value.trim()) {
        isValid = false;
        errors.push("Valid url is required.");
        urlInput.classList.add('input-error');
    } else {
        urlInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load photos
function loadPhotos() {
    photoTableBody.innerHTML = '';
    photos.forEach((photo, index) => {
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
        photoTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New photo
function createPhoto() {
    if (!validateForm()) return;

    const newPhoto = {
        id: Date.now(),
        title: titleInput.value,
        description: descriptionInput.value,
        url: urlInput.value,
        uploaded_by: uploaded_byInput.value,
        upload_date: upload_dateInput.value,
        album: albumInput.value
    };
    console.log("Saving new photo", newPhoto);
    photos.push(newPhoto);
    resetForm();
    loadPhotos();
    hideAlert();
}

// Update: Update Existing photo
function updatePhoto() {
    if (!validateForm()) return;

    const id = photoIdHiddenInput.value;
    const index = photos.findIndex(photo => photo.id == id);

    if (index !== -1) {
        photos[index] = {
            id: id,
            title: titleInput.value,
            description: descriptionInput.value,
            url: urlInput.value,
            uploaded_by: uploaded_byInput.value,
            upload_date: upload_dateInput.value,
            album: albumInput.value
        };
    }

    resetForm();
    loadPhotos();
    hideAlert();
}

// Delete: Remove a photo
function deletePhoto(index) {
    photos.splice(index, 1);
    loadPhotos();
    hideAlert();
}

// Edit: Populate Form with photo Data for Editing
function editPhoto(index) {
    const photo = photos[index];
    console.log(photo);
    photoIdHiddenInput.value = photo.id;
    titleInput.value = photo.title;
    descriptionInput.value = photo.description;
    urlInput.value = photo.url;
    uploaded_byInput.value = photo.uploaded_by;
    upload_dateInput.value = photo.upload_date;
    albumInput.value = photo.album;
}

// Reset Form
function resetForm() {
    photoIdHiddenInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    urlInput.value = '';
    uploaded_byInput.value = '';
    upload_dateInput.value = '';
    albumInput.value = '';

    urlInput.classList.remove('input-error');
}

// Form Submission Handler
photoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (photoIdHiddenInput.value) {
        updatePhoto();
    } else {
        createPhoto();
    }
});

// Initial Load
loadPhotos();
