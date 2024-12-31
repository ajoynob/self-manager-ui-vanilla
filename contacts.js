// contact.js

// DOM Elements
const contactForm = document.getElementById('contactForm');
const contactTableBody = document.getElementById('contactTableBody');
const contactIdHiddenInput = document.getElementById('contactId');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const relationInput = document.getElementById('relation');
const addressInput = document.getElementById('address');
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let contacts = [];

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

    // Phone is required
    if (!phoneInput.value.trim() || !/^\d{10,15}$/.test(phoneInput.value)) {
        isValid = false;
        errors.push("Valid Phone number (10-15 digits) is required.");
        phoneInput.classList.add('input-error');
    } else {
        phoneInput.classList.remove('input-error');
    }

    // Email is required
    if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        isValid = false;
        errors.push("Valid Email is required.");
        emailInput.classList.add('input-error');
    } else {
        emailInput.classList.remove('input-error');
    }

    // Relation has default value. Else use like relationInput.classList.add('select-error');
    //Address is optional
    //Notes is optional

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load Contacts
function loadContacts() {
    contactTableBody.innerHTML = '';
    contacts.forEach((contact, index) => {
        const row = `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>${contact.relation}</td>
        <td>
        <button onclick="editContact(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteContact(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
        contactTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New Contact
function createContact() {
    if (!validateForm()) return;

    const newContact = {
        id: Date.now(),
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        relation: relationInput.value,
        address: addressInput.value,
        notes: notesInput.value
    };
    console.log("Saving new contact", newContact);
    contacts.push(newContact);
    resetForm();
    loadContacts();
    hideAlert();
}

// Update: Update Existing Contact
function updateContact() {
    if (!validateForm()) return;

    const id = contactIdHiddenInput.value;
    const index = contacts.findIndex(contact => contact.id == id);

    if (index !== -1) {
        contacts[index] = {
            id: id,
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            relation: relationInput.value,
            address: addressInput.value,
            notes: notesInput.value
        };
    }

    resetForm();
    loadContacts();
    hideAlert();
}

// Delete: Remove a Contact
function deleteContact(index) {
    contacts.splice(index, 1);
    loadContacts();
    hideAlert();
}

// Edit: Populate Form with Contact Data for Editing
function editContact(index) {
    const contact = contacts[index];
    console.log(contact);
    contactIdHiddenInput.value = contact.id;
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    relationInput.value = contact.relation;
    addressInput.value = contact.address;
    notesInput.value = contact.notes;
}

// Reset Form
function resetForm() {
    contactIdHiddenInput.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    relationInput.value = '';
    addressInput.value = '';
    notesInput.value = '';

    nameInput.classList.remove('input-error');
    phoneInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
}

// Form Submission Handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (contactIdHiddenInput.value) {
        updateContact();
    } else {
        createContact();
    }
});

// Initial Load
loadContacts();
