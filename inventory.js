// inventory.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const inventoryForm = document.getElementById('inventoryForm');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const inventoryIdHiddenInput = document.getElementById('inventoryId');
const item_nameInput = document.getElementById('item_name');
const descriptionInput = document.getElementById('description');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const catagoryInput = document.getElementById('catagory');
const supplierInput = document.getElementById('supplier')
const purchase_dateInput = document.getElementById('purchase_date')
const expiry_dateInput = document.getElementById('expiry_date')
const locationInput = document.getElementById('location')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let inventorys = [];

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

    // item_name is required
    if (!item_nameInput.value.trim()) {
        isValid = false;
        errors.push("Item name is required.");
        item_nameInput.classList.add('input-error');
    } else {
        item_nameInput.classList.remove('input-error');
    }

    // purchase date is required
    if (!purchase_dateInput.value.trim() ) {
        isValid = false;
        errors.push("Purchase date is required.");
        purchase_dateInput.classList.add('input-error');
    } else {
        purchase_dateInput.classList.remove('input-error');
    }

    // expiry date is required
    if (!expiry_dateInput.value.trim()) {
        isValid = false;
        errors.push("Expired date is required.");
        expiry_dateInput.classList.add('input-error');
    } else {
        expiry_dateInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load inventorys
function loadInventory() {
    inventoryTableBody.innerHTML = '';
    inventorys.forEach((inventory, index) => {
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
        inventoryTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New inventory
function createInventory() {
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
        location: locationInput.value
    };
    console.log("Saving new inventory", newInventory);
    inventorys.push(newInventory);
    resetForm();
    loadInventory();
    hideAlert();
}

// Update: Update Existing inventory
function updateInventory() {
    if (!validateForm()) return;

    const id = inventoryIdHiddenInput.value;
    const index = inventorys.findIndex(inventory => inventory.id == id);

    if (index !== -1) {
        inventorys[index] = {
            id: id,
            item_name: item_nameInput.value,
            description: descriptionInput.value,
            quantity: quantityInput.value,
            price: priceInput.value,
            catagory: catagoryInput.value,
            supplier: supplierInput.value,
            purchase_date: purchase_dateInput.value,
            expiry_date: expiry_dateInput.value,
            location: locationInput.value
        };
    }

    resetForm();
    loadInventory();
    hideAlert();
}

// Delete: Remove a inventory
function deleteInventory(index) {
    inventorys.splice(index, 1);
    loadInventory();
    hideAlert();
}

// Edit: Populate Form with inventory Data for Editing
function editInventory(index) {
    const inventory = inventorys[index];
    console.log(inventory);
    inventoryIdHiddenInput.value = inventory.id;
    item_nameInput.value = inventory.item_name;
    descriptionInput.value = inventory.description;
    quantityInput.value = inventory.quantity;
    priceInput.value = inventory.price;
    catagoryInput.value = inventory.catagory;
    supplierInput.value = inventory.supplier;
    purchase_dateInput.value = inventory.purchase_date;
    expiry_dateInput.value = inventory.expiry_date;
    locationInput.value = inventory.location;
}

// Reset Form
function resetForm() {
    inventoryIdHiddenInput.value = '';
    item_nameInput.value = '';
    descriptionInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    catagoryInput.value = '';
    supplierInput.value = '';
    purchase_dateInput.value = '';
    expiry_dateInput.value = '';
    locationInput.value = '';

    item_nameInput.classList.remove('input-error');
    purchase_dateInput.classList.remove('input-error');
    expiry_dateInput.classList.remove('input-error');
}

// Form Submission Handler
inventoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inventoryIdHiddenInput.value) {
        updateInventory();
    } else {
        createInventory();
    }
});

// Initial Load
loadInventory();
