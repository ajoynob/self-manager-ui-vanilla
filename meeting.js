// meeting.js

// DOM Elements
const meetingForm = document.getElementById('meetingForm');
const meetingTableBody = document.getElementById('meetingTableBody');
const meetingIdHiddenInput = document.getElementById('meetingId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const locationInput = document.getElementById('location');
const participantsInput = document.getElementById('participants');
const statusInput = document.getElementById('status')
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let meetings = [];

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
        errors.push("Title is required.");
        titleInput.classList.add('input-error');
    } else {
        titleInput.classList.remove('input-error');
    }

    // date is required
    if (!dateInput.value.trim()) {
        isValid = false;
        errors.push("Date is required.");
        dateInput.classList.add('input-error');
    } else {
        dateInput.classList.remove('input-error');
    }

    // time is required
    if (!timeInput.value.trim()) {
        isValid = false;
        errors.push("Time is required.");
        timeInput.classList.add('input-error');
    } else {
        timeInput.classList.remove('input-error');
    }

    //Notes is optional

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load meetings
function loadMeetings() {
    meetingTableBody.innerHTML = '';
    meetings.forEach((meeting, index) => {
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
        meetingTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New meeting
function createMeeting() {
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
        notes: notesInput.value
    };
    console.log("Saving new Meeting", newMeeting);
    meetings.push(newMeeting);
    resetForm();
    loadMeetings();
    hideAlert();
}

// Update: Update Existing meeting
function updateMeeting() {
    if (!validateForm()) return;

    const id = meetingIdHiddenInput.value;
    const index = meetings.findIndex(meeting => meeting.id == id);

    if (index !== -1) {
        meetings[index] = {
            id: id,
            title: titleInput.value,
            description: descriptionInput.value,
            date: dateInput.value,
            time: timeInput.value,
            location: locationInput.value,
            participants: participantsInput.value,
            status: statusInput.value,
            notes: notesInput.value
        };
    }

    resetForm();
    loadMeetings();
    hideAlert();
}

// Delete: Remove a meeting
function deleteMeeting(index) {
    meetings.splice(index, 1);
    loadMeetings();
    hideAlert();
}

// Edit: Populate Form with meeting Data for Editing
function editMeeting(index) {
    const meeting = meetings[index];
    console.log(meeting);
    meetingIdHiddenInput.value = meeting.id;
    titleInput.value = meeting.title;
    descriptionInput.value = meeting.description;
    dateInput.value = meeting.date;
    timeInput.value = meeting.time;
    locationInput.value = meeting.location;
    participantsInput.value = meeting.participants;
    statusInput.value = meeting.status;
    notesInput.value = meeting.notes;
}

// Reset Form
function resetForm() {
    meetingIdHiddenInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
    locationInput.value = '';
    participantsInput.value = '';
    statusInput.value = '';
    notesInput.value = '';

    titleInput.classList.remove('input-error');
    dateInput.classList.remove('input-error');
    timeInput.classList.remove('input-error');
}

// Form Submission Handler
meetingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (meetingIdHiddenInput.value) {
        updateMeeting();
    } else {
        createMeeting();
    }
});

// Initial Load
loadMeetings();
