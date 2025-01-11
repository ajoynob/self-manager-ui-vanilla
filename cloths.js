// cloths.js

// DOM Elements
const clothForm = document.getElementById('clothForm');
const clothTableBody = document.getElementById('clothTableBody');
const clothIdHiddenInput = document.getElementById('clothId');
const item_nameInput = document.getElementById('item_name');
const sizeInput = document.getElementById('size');
const colorInput = document.getElementById('color');
const materialInput = document.getElementById('material');
const purchase_dateInput = document.getElementById('purchase_date');
const priceInput = document.getElementById('price');
const catagoryInput = document.getElementById('catagory');
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let cloths = [];

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
    if (!item_nameInput.value.trim()) {
        isValid = false;
        errors.push("Item Name is required.");
        item_nameInput.classList.add('input-error');
    } else {
        item_nameInput.classList.remove('input-error');
    }

    // material has default value. Else use like materialInput.classList.add('select-error');
    //Notes is optional

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load cloths
function loadCloths() {
    clothTableBody.innerHTML = '';
    cloths.forEach((cloth, index) => {
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
        clothTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New cloth
function createCloth() {
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
        notes: notesInput.value
    };
    console.log("Saving new Cloth", newCloth);
    cloths.push(newCloth);
    resetForm();
    loadCloths();
    hideAlert();
}

// Update: Update Existing cloth
function updateCloth() {
    if (!validateForm()) return;

    const id = clothIdHiddenInput.value;
    const index = cloths.findIndex(cloth => cloth.id == id);

    if (index !== -1) {
        cloths[index] = {
            id: id,
            item_name: item_nameInput.value,
            size: sizeInput.value,
            color: colorInput.value,
            material: materialInput.value,
            purchase_date: purchase_dateInput.value,
            price: priceInput.value,
            catagory: catagoryInput.value,
            notes: notesInput.value
        };
    }

    resetForm();
    loadCloths();
    hideAlert();
}

// Delete: Remove a cloth
function deleteCloth(index) {
    cloths.splice(index, 1);
    loadCloths();
    hideAlert();
}

// Edit: Populate Form with cloth Data for Editing
function editCloth(index) {
    const cloth = cloths[index];
    console.log(cloth);
    clothIdHiddenInput.value = cloth.id;
    item_nameInput.value = cloth.item_name;
    sizeInput.value = cloth.size;
    colorInput.value = cloth.color;
    materialInput.value = cloth.material;
    purchase_dateInput.value = cloth.purchase_date;
    priceInput.value = cloth.price;
    catagoryInput.value = cloth.catagory;
    notesInput.value = cloth.notes;
}

// Reset Form
function resetForm() {
    clothIdHiddenInput.value = '';
    item_nameInput.value = '';
    sizeInput.value = '';
    colorInput.value = '';
    materialInput.value = '';
    purchase_dateInput.value = '';
    priceInput.value = '';
    catagoryInput.value = '';
    notesInput.value = '';

    item_nameInput.classList.remove('input-error');
    sizeInput.classList.remove('input-error');
    colorInput.classList.remove('input-error');
}

// Form Submission Handler
clothForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (clothIdHiddenInput.value) {
        updateCloth();
    } else {
        createCloth();
    }
});

// Initial Load
loadCloths();
