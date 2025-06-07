if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const groceriesForm = document.getElementById("groceriesForm");
const groceriesTableBody = document.getElementById("groceriesTableBody");
const groceriesIdHiddenInput = document.getElementById("groceriesId");
const nameInput = document.getElementById("item_name");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const purchasedInput = document.getElementById("purchased");
const purchase_dateInput = document.getElementById("purchase_date");
const catagoryInput = document.getElementById("catagory");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/groceries";

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

  if (!nameInput.value.trim()) {
    isValid = false;
    errors.push("Name is required.");
    nameInput.classList.add("input-error");
  } else {
    nameInput.classList.remove("input-error");
  }

  if (!quantityInput.value.trim()) {
    isValid = false;
    errors.push("Quantity is required.");
    quantityInput.classList.add("input-error");
  } else {
    quantityInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

//  Load groceries from API
async function loadGroceries() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    groceriesTableBody.innerHTML = "";
    data.forEach((groceries) => {
      groceries.id = groceries.$loki;
      const row = `
      <tr>
        <td>${groceries.item_name}</td>
        <td>${groceries.quantity}</td>
        <td>${groceries.price}</td>
        <td>${groceries.purchased}</td>
        <td>${groceries.purchase_date}</td>
        <td>
        <button onclick="editGroceries(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteGroceries(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      groceriesTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load groceries.");
    console.error(error);
  }
}

// Create a New groceries via API
async function createGroceries() {
  if (!validateForm()) return;

  const newGroceries = {
    id: Date.now(),
    item_name: nameInput.value,
    quantity: quantityInput.value,
    price: priceInput.value,
    purchased: purchasedInput.value,
    date: purchase_dateInput.value,
    catagory: catagoryInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newGroceries),
    });

    if (!response.ok) {
      throw new Error("Failed to create groceries.");
    }

    resetForm();
    loadGroceries();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing groceries via API
async function updateGroceries() {
  if (!validateForm()) return;

  const id = groceriesIdHiddenInput.value;
  const updatedGroceries = {
    item_name: nameInput.value,
    quantity: quantityInput.value,
    price: priceInput.value,
    purchased: purchasedInput.value,
    date: purchase_dateInput.value,
    catagory: catagoryInput.value,
  };

  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedGroceries),
    });

    if (!response.ok) {
      throw new Error("Failed to update groceries.");
    }

    resetForm();
    loadGroceries();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete groceries via API
async function deleteGroceries(id) {
  if (!confirm("Are you sure you want to delete this groceries?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete groceries.");
    }

    loadGroceries();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Groceries: Fetch Data by ID and Populate Form
async function editGroceries(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load groceries.");
    }

    const groceries = await response.json();
    groceries.id = groceries.$loki;

    groceriesIdHiddenInput.value = groceries.id;
    nameInput.value = groceries.item_name;
    quantityInput.value = groceries.quantity;
    priceInput.value = groceries.price;
    purchasedInput.value = groceries.purchased || "";
    purchase_dateInput.value = groceries.purchase_date || "";
    catagoryInput.value = groceries.catagory || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  groceriesIdHiddenInput.value = "";
  nameInput.value = "";
  quantityInput.value = "";
  priceInput.value = "";
  purchasedInput.value = "";
  purchase_dateInput.value = "";
  catagoryInput.value = "";

  nameInput.classList.remove("input-error");
  quantityInput.classList.remove("input-error");
}

// Form Submission Handler
groceriesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (groceriesIdHiddenInput.value) {
    updateGroceries();
  } else {
    createGroceries();
  }
});

// Initial Load
loadGroceries();
