// cloths.js
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const clothForm = document.getElementById("clothForm");
const clothTableBody = document.getElementById("clothTableBody");
const clothIdHiddenInput = document.getElementById("clothId");
const item_nameInput = document.getElementById("item_name");
const sizeInput = document.getElementById("size");
const colorInput = document.getElementById("color");
const materialInput = document.getElementById("material");
const purchase_dateInput = document.getElementById("purchase_date");
const priceInput = document.getElementById("price");
const catagoryInput = document.getElementById("catagory");
const notesInput = document.getElementById("notes");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/cloths";

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

// Validation Function
function validateForm() {
  hideAlert(); // Clear previous alerts
  let isValid = true;
  let errors = [];

  if (!item_nameInput.value.trim()) {
    isValid = false;
    errors.push("Item Name is required.");
    item_nameInput.classList.add("input-error");
  } else {
    item_nameInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load Contacts from API
async function loadCloths() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    clothTableBody.innerHTML = "";

    data.forEach((cloth) => {
      cloth.id = cloth.$loki;
      const row = `
      <tr>
        <td>${cloth.item_name}</td>
        <td>${cloth.size}</td>
        <td>${cloth.color}</td>
        <td>${cloth.material}</td>
        <td>${cloth.purchase_date}</td>
        <td>${cloth.price}</td>
        <td>
        <button onclick="editCloth(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteCloth(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      clothTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load cloths.");
    console.error(error);
  }
}

// Create a New cloth via API
async function createCloth() {
  if (!validateForm()) return;

  const newCloth = {
    id: Date.now(),
    item_name: item_nameInput.value,
    size: sizeInput.value,
    color: colorInput.value,
    material: materialInput.value,
    purchase_date: purchase_dateInput.value,
    price: priceInput.value,
    catagory: catagoryInput.value,
    notes: notesInput.value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCloth),
    });

    if (!response.ok) {
      throw new Error("Failed to create cloth.");
    }

    resetForm();
    loadCloths();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing cloth via API
async function updateCloth() {
  if (!validateForm()) return;

  const id = clothIdHiddenInput.value;
  const updatedCloth = {
    item_name: item_nameInput.value,
    size: sizeInput.value,
    color: colorInput.value,
    material: materialInput.value,
    purchase_date: purchase_dateInput.value,
    price: priceInput.value,
    catagory: catagoryInput.value,
    notes: notesInput.value,
  };

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCloth),
    });

    if (!response.ok) {
      throw new Error("Failed to update cloth.");
    }

    resetForm();
    loadCloths();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete cloth via API
async function deleteCloth(id) {
  if (!confirm("Are you sure you want to delete this cloth?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete cloth.");
    }

    loadCloths();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit cloth: Fetch Data by ID and Populate Form
async function editCloth(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load cloth.");
    }

    const cloth = await response.json();
    cloth.id = cloth.$loki;

    clothIdHiddenInput.value = cloth.id;
    item_nameInput.value = cloth.item_name;
    sizeInput.value = cloth.size;
    colorInput.value = cloth.color;
    materialInput.value = cloth.material;
    purchase_dateInput.value = cloth.purchase_date;
    priceInput.value = cloth.price;
    catagoryInput.value = cloth.catagory || "";
    notesInput.value = cloth.notes || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  clothIdHiddenInput.value = "";
  item_nameInput.value = "";
  sizeInput.value = "";
  colorInput.value = "";
  materialInput.value = "";
  purchase_dateInput.value = "";
  priceInput.value = "";
  catagoryInput.value = "";
  notesInput.value = "";

  item_nameInput.classList.remove("input-error");
  sizeInput.classList.remove("input-error");
  colorInput.classList.remove("input-error");
}

// Form Submission Handler
clothForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (clothIdHiddenInput.value) {
    updateCloth();
  } else {
    createCloth();
  }
});

// Initial Load
loadCloths();
