if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const inventoryForm = document.getElementById("inventoryForm");
const inventoryTableBody = document.getElementById("inventoryTableBody");
const inventoryIdHiddenInput = document.getElementById("inventoryId");
const item_nameInput = document.getElementById("item_name");
const descriptionInput = document.getElementById("description");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const catagoryInput = document.getElementById("catagory");
const supplierInput = document.getElementById("supplier");
const purchase_dateInput = document.getElementById("purchase_date");
const expiry_dateInput = document.getElementById("expiry_date");
const locationInput = document.getElementById("location");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/inventorys";

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

  if (!item_nameInput.value.trim()) {
    isValid = false;
    errors.push("Item name is required.");
    item_nameInput.classList.add("input-error");
  } else {
    item_nameInput.classList.remove("input-error");
  }

  if (!purchase_dateInput.value.trim()) {
    isValid = false;
    errors.push("Purchase date is required.");
    purchase_dateInput.classList.add("input-error");
  } else {
    purchase_dateInput.classList.remove("input-error");
  }

  if (!expiry_dateInput.value.trim()) {
    isValid = false;
    errors.push("Expired date is required.");
    expiry_dateInput.classList.add("input-error");
  } else {
    expiry_dateInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load inventorys from API
async function loadInventory() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    inventoryTableBody.innerHTML = "";
    data.forEach((inventory) => {
      inventory.id = inventory.$loki;
      const row = `
      <tr>
        <td>${inventory.item_name}</td>
        <td>${inventory.quantity}</td>
        <td>${inventory.price}</td>
        <td>${inventory.purchase_date}</td>
        <td>${inventory.expiry_date}</td>
        <td>${inventory.location}</td>
        <td>
        <button onclick="editInventory(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteInventory(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      inventoryTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load inventory.");
    console.error(error);
  }
}

// Create a New inventory via API
async function createInventory() {
  if (!validateForm()) return;

  const newInventory = {
    id: Date.now(),
    item_name: item_nameInput.value,
    description: descriptionInput.value,
    quantity: quantityInput.value,
    price: priceInput.value,
    catagory: catagoryInput.value,
    supplier: supplierInput.value,
    purchase_date: purchase_dateInput.value,
    expiry_date: expiry_dateInput.value,
    location: locationInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newInventory),
    });

    if (!response.ok) {
      throw new Error("Failed to create inventory.");
    }

    resetForm();
    loadInventory();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing inventory via API
async function updateInventory() {
  if (!validateForm()) return;

  const id = inventoryIdHiddenInput.value;
  const updatedInventory = {
    item_name: item_nameInput.value,
    description: descriptionInput.value,
    quantity: quantityInput.value,
    price: priceInput.value,
    catagory: catagoryInput.value,
    supplier: supplierInput.value,
    purchase_date: purchase_dateInput.value,
    expiry_date: expiry_dateInput.value,
    location: locationInput.value,
  };
  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedInventory),
    });

    if (!response.ok) {
      throw new Error("Failed to update inventory.");
    }

    resetForm();
    loadInventory();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete inventory via API
async function deleteInventory(id) {
  if (!confirm("Are you sure you want to delete this inventory?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete inventory.");
    }

    loadInventory();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Inventory: Fetch Data by ID and Populate Form
async function editInventory(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load inventory.");
    }

    const inventory = await response.json();
    inventory.id = inventory.$loki;

    inventoryIdHiddenInput.value = inventory.id;
    item_nameInput.value = inventory.item_name;
    descriptionInput.value = inventory.description;
    quantityInput.value = inventory.quantity;
    priceInput.value = inventory.price;
    catagoryInput.value = inventory.catagory;
    supplierInput.value = inventory.supplier;
    purchase_dateInput.value = inventory.purchase_date || "";
    expiry_dateInput.value = inventory.expiry_date || "";
    locationInput.value = inventory.location;
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  inventoryIdHiddenInput.value = "";
  item_nameInput.value = "";
  descriptionInput.value = "";
  quantityInput.value = "";
  priceInput.value = "";
  catagoryInput.value = "";
  supplierInput.value = "";
  purchase_dateInput.value = "";
  expiry_dateInput.value = "";
  locationInput.value = "";

  item_nameInput.classList.remove("input-error");
  purchase_dateInput.classList.remove("input-error");
  expiry_dateInput.classList.remove("input-error");
}

// Form Submission Handler
inventoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inventoryIdHiddenInput.value) {
    updateInventory();
  } else {
    createInventory();
  }
});

// Initial Load
loadInventory();
