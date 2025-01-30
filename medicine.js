// medicine.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const medicineForm = document.getElementById('medicineForm');
const medicineTableBody = document.getElementById('medicineTableBody');
const medicineIdHiddenInput = document.getElementById('medicineId');
const nameInput = document.getElementById('name');
const dosageInput = document.getElementById('dosage');
const frequencyInput = document.getElementById('frequency');
const start_dateInput = document.getElementById('start_date');
const end_dateInput = document.getElementById('end_date');
const statusInput = document.getElementById('status');
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let medicines = [];

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

    // Name is required
    if (!nameInput.value.trim()) {
        isValid = false;
        errors.push("Name is required.");
        nameInput.classList.add('input-error');
    } else {
        nameInput.classList.remove('input-error');
    }

    // dosage is required
    if (!dosageInput.value.trim()) {
        isValid = false;
        errors.push("Dosage is required.");
        dosageInput.classList.add('input-error');
    } else {
        dosageInput.classList.remove('input-error');
    }

    if (!statusInput.value.trim()) {
        isValid = false;
        errors.push("Status is required.");
        statusInput.classList.add('input-error');
    } else {
        statusInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load medicines
function loadMedicines() {
    medicineTableBody.innerHTML = '';
    medicines.forEach((medicine, index) => {
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
        medicineTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New medicine
function createMedicine() {
    if (!validateForm()) return;

    const newMedicine = {
        id: Date.now(),
        name: nameInput.value,
        dosage: dosageInput.value,
        frequency: frequencyInput.value,
        start_date: start_dateInput.value,
        end_date: end_dateInput.value,
        status: statusInput.value,
        notes: notesInput.value
    };
    console.log("Saving new medicine", newMedicine);
    medicines.push(newMedicine);
    resetForm();
    loadMedicines();
    hideAlert();
}

// Update: Update Existing medicine
function updateMedicine() {
    if (!validateForm()) return;

    const id = medicineIdHiddenInput.value;
    const index = medicines.findIndex(medicine => medicine.id == id);

    if (index !== -1) {
        medicines[index] = {
            id: id,
            name: nameInput.value,
            dosage: dosageInput.value,
            frequency: frequencyInput.value,
            start_date: start_dateInput.value,
            end_date: end_dateInput.value,
            status: statusInput.value,
            notes: notesInput.value
        };
    }

    resetForm();
    loadMedicines();
    hideAlert();
}

// Delete: Remove a medicine
function deleteMedicine(index) {
    medicines.splice(index, 1);
    loadMedicines();
    hideAlert();
}

// Edit: Populate Form with medicine Data for Editing
function editMedicine(index) {
    const medicine = medicines[index];
    console.log(medicine);
    medicineIdHiddenInput.value = medicine.id;
    nameInput.value = medicine.name;
    dosageInput.value = medicine.dosage;
    frequencyInput.value = medicine.frequency;
    start_dateInput.value = medicine.start_date;
    end_dateInput.value = medicine.end_date;
    statusInput.value = medicine.status;
    notesInput.value = medicine.notes;
}

// Reset Form
function resetForm() {
    medicineIdHiddenInput.value = '';
    nameInput.value = '';
    dosageInput.value = '';
    frequencyInput.value = '';
    start_dateInput.value = '';
    end_dateInput.value = '';
    statusInput.value = '';
    notesInput.value = '';

    nameInput.classList.remove('input-error');
    dosageInput.classList.remove('input-error');
    statusInput.classList.remove('input-error');
}

// Form Submission Handler
medicineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (medicineIdHiddenInput.value) {
        updateMedicine();
    } else {
        createMedicine();
    }
});

// Initial Load
loadMedicines();
