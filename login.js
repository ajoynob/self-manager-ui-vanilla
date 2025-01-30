// Users Array
const users = [
  { email: "user1@example.com", password: "password1", name: "User 1" },
  { email: "user2@example.com", password: "password2", name: "User 2" },
  { email: "user3@example.com", password: "password3", name: "User 3" },
];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// Show Alert
function showAlert(message) {
  alertMessage.innerText = message;
  alertBox.classList.remove('hidden');
}

// Hide Alert
function hideAlert() {
  alertBox.classList.add('hidden');
  alertMessage.innerText = '';
}

// Token generation & store in local storage
function saveUserToken(token, name) {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
}

function login() {
  hideAlert(); // Clear any previous alerts

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Find User
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    alert("Login successful! Redirecting...");

    // Save user token in local storage
    let token = Math.random().toString(36).substring(2);
    saveUserToken(token, user.name);

    // Redirect to dashboard or another page here
    window.location.href = "contacts.html";
  } else {
    showAlert("Invalid credentials");
  }

  // Clear input fields
  emailInput.value = '';
  passwordInput.value = '';
}

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission
  login()
});
