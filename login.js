// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// Base API URL
const API_URL = "http://localhost:3000/login";

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

// Save JWT token to localStorage
function saveUserToken(token, name) {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
}

// Login
async function login() {
  hideAlert();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    saveUserToken(data.token, data.name);
    alert("Login successful! Redirecting...");
    window.location.href = "contacts.html";
  } catch (err) {
    showAlert(err.message);
  }

  emailInput.value = '';
  passwordInput.value = '';
}

// Form Submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});
