// call.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const callForm = document.getElementById('callForm');
const callTableBody = document.getElementById('callTableBody');
const callIdHiddenInput = document.getElementById('call_Id');
const contact_idInput = document.getElementById('contact_id');
const call_dateInput = document.getElementById('call_date');
const call_timeInput = document.getElementById('call_time');
const call_purposeInput = document.getElementById('call_purpose');
const repeat_intervalInput = document.getElementById('repeat_interval');
const statusInput = document.getElementById('status');
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let calls = [];

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

    // Contact id is required
    if (!contact_idInput.value.trim()) {
        isValid = false;
        errors.push("Contact id is required.");
        contact_idInput.classList.add('input-error');
    } else {
        contact_idInput.classList.remove('input-error');
    }

    // Time is required
    if (!call_timeInput.value.trim() || !/^\S+:\S+$/.test(call_timeInput.value)) {
        isValid = false;
        errors.push("Call time is required (format:(00:00:00 AM)).");
        call_timeInput.classList.add('input-error');
    } else {
        call_timeInput.classList.remove('input-error');
    }

    // Date is required
    if (!call_dateInput.value.trim()) {
        isValid = false;
        errors.push("Call date is required (format: (dd/mm/yy)).");
        call_dateInput.classList.add('input-error');
    } else {
        call_dateInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load Call_Schedules
function loadCalls() {
    callTableBody.innerHTML = '';
    calls.forEach((call, index) => {
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
        callTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New Call_Schedule
function createCall() {
    if (!validateForm()) return;

    const newCall = {
        id: Date.now(),
        contact_id: contact_idInput.value,
        call_date: call_dateInput.value,
        call_time: call_timeInput.value,
        call_purpose: call_purposeInput.value,
        repeat_interval: repeat_intervalInput.value,
        status: statusInput.value,
        notes: notesInput.value
    };
    console.log("Saving new calls", newCall);
    calls.push(newCall);
    resetForm();
    loadCalls();
    hideAlert();
}

// Update: Update Existing Call_Schedule
function updateCall() {
    if (!validateForm()) return;

    const id = callIdHiddenInput.value;
    const index = calls.findIndex(call => call.id == id);

    if (index !== -1) {
        calls[index] = {
        id: id,
        contact_id: contact_idInput.value,
        call_date: call_dateInput.value,
        call_time: call_timeInput.value,
        call_purpose: call_purposeInput.value,
        repeat_interval: repeat_intervalInput.value,
        status: statusInput.value,
        notes: notesInput.value
        };
    }

    resetForm();
    loadCalls();
    hideAlert();
}

// Delete: Remove a Call
function deleteCall(index) {
    calls.splice(index, 1);
    loadCalls();
    hideAlert();
}

// Edit: Populate Form with Call Data for Editing
function editCall(index) {
    const call = calls[index];
    console.log(call);
    callIdHiddenInput.value = call.call_Id;
    contact_idInput.value = call.contact_id;
    call_dateInput.value = call.call_date;
    call_timeInput.value = call.call_time;
    call_purposeInput.value = call.call_purpose;
    repeat_intervalInput.value = call.repeat_interval;
    statusInput.value = call.status;
    notesInput.value = call.notes;
}

// Reset Form
function resetForm() {
    callIdHiddenInput.value = '';
    contact_idInput.value = '';
    call_dateInput.value = '';
    call_timeInput.value = '';
    call_purposeInput.value = '';
    repeat_intervalInput.value = 'Scheduled';
    statusInput.value = 'None';
    notesInput.value = '';

    contact_idInput.classList.remove('input-error');
    call_dateInput.classList.remove('input-error');
    call_timeInput.classList.remove('input-error');
}

// Form Submission Handler
callForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (callIdHiddenInput.value) {
        updateCall();
    } else {
        createCall();
    }
});

// Initial Load
loadCalls();
