if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");
const userIdHiddenInput = document.getElementById("userId");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/users";

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

  if (!usernameInput.value.trim()) {
    isValid = false;
    errors.push("Username is required. ");
    usernameInput.classList.add("input-error");
  } else {
    usernameInput.classList.remove("input-error");
  }

  if (!passwordInput.value.trim() || !/^\d{10,15}$/.test(passwordInput.value)) {
    isValid = false;
    errors.push("Strong Password (10-15 digits) is required. ");
    passwordInput.classList.add("input-error");
  } else {
    passwordInput.classList.remove("input-error");
  }

  if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
    isValid = false;
    errors.push("Valid Email is required.");
    emailInput.classList.add("input-error");
  } else {
    emailInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load Users from API
async function loadUsers() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    userTableBody.innerHTML = "";
    data.forEach((user) => {
      user.id = user.$loki;
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
      userTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load groceries.");
    console.error(error);
  }
}

// Create a New User via API
async function createUser() {
  if (!validateForm()) return;

  const newUser = {
    id: Date.now(),
    username: usernameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
    role: roleInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to create users.");
    }

    resetForm();
    loadUsers();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing User
async function updateUser() {
  if (!validateForm()) return;

  const id = userIdHiddenInput.value;
  const updatedUser = {
    username: usernameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
    role: roleInput.value,
  };
  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Failed to update users.");
    }

    resetForm();
    loadUsers();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete User via API
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete user.");
    }

    loadUsers();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit user: Fetch Data by ID and Populate Form
async function editUser(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load user.");
    }

    const user = await response.json();
    user.id = user.$loki;

    userIdHiddenInput.value = user.id;
    usernameInput.value = user.username;
    passwordInput.value = user.password;
    emailInput.value = user.email;
    roleInput.value = user.role;
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  userIdHiddenInput.value = "";
  usernameInput.value = "";
  passwordInput.value = "";
  emailInput.value = "";
  roleInput.value = "";

  usernameInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
  emailInput.classList.remove("input-error");
}

// Form Submission Handler
userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (userIdHiddenInput.value) {
    updateUser();
  } else {
    createUser();
  }
});

// Initial Load
loadUsers();
