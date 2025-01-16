// user.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
const userIdHiddenInput = document.getElementById('userId');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const roleInput = document.getElementById('role');
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let users = [];

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

    // Username is required
    if (!usernameInput.value.trim()) {
        isValid = false;
        errors.push("Username is required. ");
        usernameInput.classList.add('input-error');
    } else {
        usernameInput.classList.remove('input-error');
    }

    // Password is required
    if (!passwordInput.value.trim() || !/^\d{10,15}$/.test(passwordInput.value)) {
        isValid = false;
        errors.push("Strong Password (10-15 digits) is required. ");
        passwordInput.classList.add('input-error');
    } else {
        passwordInput.classList.remove('input-error');
    }

    // Email is required
    if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        isValid = false;
        errors.push("Valid Email is required.");
        emailInput.classList.add('input-error');
    } else {
        emailInput.classList.remove('input-error');
    }

    // Role has default value. Else use like roleInput.classList.add('select-error');
    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load Users
function loadUsers() {
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
        const row = `
      <tr>
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
        <button onclick="editUser(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteUser(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New User
function createUser() {
    if (!validateForm()) return;

    const newUser = {
        id: Date.now(),
        username: usernameInput.value,
        password: passwordInput.value,
        email: emailInput.value,
        role: roleInput.value,
    };
    console.log("Saving new user", newUser);
    users.push(newUser);
    resetForm();
    loadUsers();
    hideAlert();
}

// Update: Update Existing User
function updateUser() {
    if (!validateForm()) return;

    const id = userIdHiddenInput.value;
    const index = users.findIndex(user => user.id == id);

    if (index !== -1) {
        users[index] = {
            id: id,
            username: usernameInput.value,
            password: passwordInput.value,
            email: emailInput.value,
            role: roleInput.value,
        };
    }

    resetForm();
    loadUsers();
    hideAlert();
}

// Delete: Remove a User
function deleteUser(index) {
    users.splice(index, 1);
    loadUsers();
    hideAlert();
}

// Edit: Populate Form with User Data for Editing
function editUser(index) {
    const user = users[index];
    console.log(user);
    userIdHiddenInput.value = user.id;
    usernameInput.value = user.username;
    passwordInput.value = user.password;
    emailInput.value = user.email;
    roleInput.value = user.role;
}

// Reset Form
function resetForm() {
    userIdHiddenInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    emailInput.value = '';
    roleInput.value = '';

    usernameInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
}

// Form Submission Handler
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (userIdHiddenInput.value) {
        updateUser();
    } else {
        createUser();
    }
});

// Initial Load
loadUsers();
