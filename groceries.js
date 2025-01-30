// groceries
//.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const groceriesForm = document.getElementById('groceriesForm');
const groceriesTableBody = document.getElementById('groceriesTableBody');
const groceriesIdHiddenInput = document.getElementById('groceriesId');
const nameInput = document.getElementById('item_name');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const purchasedInput = document.getElementById('purchased');
const purchase_dateInput = document.getElementById('purchase_date');
const catagoryInput = document.getElementById('catagory')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let Groceries = [];

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

    // quantity is required
    if (!quantityInput.value.trim()) {
        isValid = false;
        errors.push("Quantity is required.");
        quantityInput.classList.add('input-error');
    } else {
        quantityInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load groceries
//s
function loadGroceries() {
    groceriesTableBody.innerHTML = '';
    Groceries.forEach((groceries, index) => {
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
        groceriesTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New groceries
function createGroceries() {
    if (!validateForm()) return;

    const newGroceries= {
        id: Date.now(),
        item_name: nameInput.value,
        quantity: quantityInput.value,
        price: priceInput.value,
        purchased: purchasedInput.value,
        date: purchase_dateInput.value,
        catagory: catagoryInput.value
    };
    console.log("Saving new groceries", newGroceries);
    Groceries.push(newGroceries);
    resetForm();
    loadGroceries();
    hideAlert();
}

// Update: Update Existing groceries
function updateGroceries() {
    if (!validateForm()) return;

    const id = groceriesIdHiddenInput.value;
    const index = Groceries.findIndex(groceries=> groceries.id == id);

    if (index !== -1) {
        Groceries[index] = {
            id: id,
            item_name: nameInput.value,
            quantity: quantityInput.value,
            price: priceInput.value,
            purchased: purchasedInput.value,
            date: purchase_dateInput.value,
            catagory: catagoryInput.value
        };
    }

    resetForm();
    loadGroceries();
    hideAlert();
}

// Delete: Remove a groceries
function deleteGroceries(index) {
    Groceries.splice(index, 1);
    loadGroceries();
    hideAlert();
}

// Edit: Populate Form with groceries
// Data for Editing
function editGroceries(index) {
    const groceries= Groceries[index];
    console.log(groceries);
    groceriesIdHiddenInput.value = groceries.id;
    nameInput.value = groceries.item_name;
    quantityInput.value = groceries.quantity;
    priceInput.value = groceries.price;
    purchasedInput.value = groceries.purchased;
    purchase_dateInput.value = groceries.purchase_date;
    catagoryInput.value = groceries.catagory;
}

// Reset Form
function resetForm() {
    groceriesIdHiddenInput.value = '';
    nameInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    purchasedInput.value = '';
    purchase_dateInput.value = '';
    catagoryInput.value = '';

    nameInput.classList.remove('input-error');
    quantityInput.classList.remove('input-error');
}

// Form Submission Handler
groceriesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (groceriesIdHiddenInput.value) {
        updateGroceries();
    } else {
        createGroceries();
    }
});

// Initial Load
loadGroceries();
