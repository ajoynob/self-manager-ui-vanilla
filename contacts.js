// contact.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const contactForm = document.getElementById('contactForm');
const contactTableBody = document.getElementById('contactTableBody');
const contactIdHiddenInput = document.getElementById('contactId');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const relationInput = document.getElementById('relation');
const addressInput = document.getElementById('address');
const notesInput = document.getElementById('notes');
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// Base API URL
const API_URL = 'http://localhost:3000/contacts';

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
    hideAlert();
    let isValid = true;
    let errors = [];

    if (!nameInput.value.trim()) {
        isValid = false;
        errors.push("Name is required.");
        nameInput.classList.add('input-error');
    } else {
        nameInput.classList.remove('input-error');
    }

    if (!phoneInput.value.trim() || !/^\d{10,15}$/.test(phoneInput.value)) {
        isValid = false;
        errors.push("Valid Phone number (10-15 digits) is required.");
        phoneInput.classList.add('input-error');
    } else {
        phoneInput.classList.remove('input-error');
    }

    if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        isValid = false;
        errors.push("Valid Email is required.");
        emailInput.classList.add('input-error');
    } else {
        emailInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Load Contacts from API
async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        contactTableBody.innerHTML = '';

        data.forEach(contact => {
            contact.id = contact.$loki;
            const row = `
                <tr>
                    <td>${contact.name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email}</td>
                    <td>${contact.relation || ''}</td>
                    <td>
                        <button onclick="editContact('${contact.id}')" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="deleteContact('${contact.id}')" class="btn btn-sm btn-error">Delete</button>
                    </td>
                </tr>
            `;
            contactTableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        showAlert('Failed to load contacts.');
        console.error(error);
    }
}

// Create New Contact via API
async function createContact() {
    if (!validateForm()) return;

    const newContact = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        relation: relationInput.value,
        address: addressInput.value,
        notes: notesInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });

        if (!response.ok) {
            throw new Error('Failed to create contact.');
        }

        resetForm();
        loadContacts();
        hideAlert();
    } catch (error) {
        showAlert(error.message);
    }
}

// Update Existing Contact via API
async function updateContact() {
    if (!validateForm()) return;

    const id = contactIdHiddenInput.value;
    const updatedContact = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        relation: relationInput.value,
        address: addressInput.value,
        notes: notesInput.value
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
        });

        if (!response.ok) {
            throw new Error('Failed to update contact.');
        }

        resetForm();
        loadContacts();
        hideAlert();
    } catch (error) {
        showAlert(error.message);
    }
}

// Delete Contact via API
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error('Failed to delete contact.');
        }

        loadContacts();
        hideAlert();
    } catch (error) {
        showAlert(error.message);
    }
}

// Edit Contact: Fetch Data by ID and Populate Form
async function editContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to load contact.');
        }

        const contact = await response.json();
        contact.id = contact.$loki;

        contactIdHiddenInput.value = contact.id;
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
        emailInput.value = contact.email;
        relationInput.value = contact.relation || '';
        addressInput.value = contact.address || '';
        notesInput.value = contact.notes || '';
    } catch (error) {
        showAlert(error.message);
    }
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
