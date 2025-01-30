// research.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
} 

// DOM Elements
const researchForm = document.getElementById('researchForm');
const researchTableBody = document.getElementById('researchTableBody');
const researchIdHiddenInput = document.getElementById('researchId');
const titleInput = document.getElementById('title');
const fieldInput = document.getElementById('field');
const descriptionInput = document.getElementById('description');
const start_dateInput = document.getElementById('start_date');
const end_dateInput = document.getElementById('end_date');
const statusInput = document.getElementById('status')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let researches = [];

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

    // title is required
    if (!titleInput.value.trim()) {
        isValid = false;
        errors.push("title is required.");
        titleInput.classList.add('input-error');
    } else {
        titleInput.classList.remove('input-error');
    }

    // field is required
    if (!fieldInput.value.trim()) {
        isValid = false;
        errors.push("Field is required.");
        fieldInput.classList.add('input-error');
    } else {
        fieldInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load researchs
function loadResearches() {
    researchTableBody.innerHTML = '';
    researches.forEach((research, index) => {
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
        researchTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New research
function createResearch() {
    if (!validateForm()) return;

    const newResearch = {
        id: Date.now(),
        title: titleInput.value,
        field: fieldInput.value,
        description: descriptionInput.value,
        start_date: start_dateInput.value,
        end_date: end_dateInput.value,
        status: statusInput.value
    };
    console.log("Saving new research", newResearch);
    researches.push(newResearch);
    resetForm();
    loadResearches();
    hideAlert();
}

// Update: Update Existing research
function updateResearch() {
    if (!validateForm()) return;

    const id = researchIdHiddenInput.value;
    const index = researches.findIndex(research => research.id == id);

    if (index !== -1) {
        researches[index] = {
            id: id,
            title: titleInput.value,
            field: fieldInput.value,
            description: descriptionInput.value,
            start_date: start_dateInput.value,
            end_date: end_dateInput.value,
            status: statusInput.value
        };
    }

    resetForm();
    loadResearches();
    hideAlert();
}

// Delete: Remove a research
function deleteResearch(index) {
    researches.splice(index, 1);
    loadResearches();
    hideAlert();
}

// Edit: Populate Form with research Data for Editing
function editResearch(index) {
    const research = researches[index];
    console.log(research);
    researchIdHiddenInput.value = research.id;
    titleInput.value = research.title;
    fieldInput.value = research.field;
    descriptionInput.value = research.description;
    start_dateInput.value = research.start_date;
    end_dateInput.value = research.end_date;
    statusInput.value = research.status;
}

// Reset Form
function resetForm() {
    researchIdHiddenInput.value = '';
    titleInput.value = '';
    fieldInput.value = '';
    descriptionInput.value = '';
    start_dateInput.value = '';
    end_dateInput.value = '';
    statusInput.value = '';

    titleInput.classList.remove('input-error');
    fieldInput.classList.remove('input-error');
}

// Form Submission Handler
researchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (researchIdHiddenInput.value) {
        updateResearch();
    } else {
        createResearch();
    }
});

// Initial Load
loadResearches();
