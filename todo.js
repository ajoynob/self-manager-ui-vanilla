// todo.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoTableBody = document.getElementById('todoTableBody');
const todoIdHiddenInput = document.getElementById('todoId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const due_dateInput = document.getElementById('due_date');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let todos = [];

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

    // title is required
    if (!titleInput.value.trim()) {
        isValid = false;
        errors.push("title is required.");
        titleInput.classList.add('input-error');
    } else {
        titleInput.classList.remove('input-error');
    }

    // due_date is required
    if (!due_dateInput.value.trim()) {
        isValid = false;
        errors.push("Due date is required.");
        due_dateInput.classList.add('input-error');
    } else {
        due_dateInput.classList.remove('input-error');
    }

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load todos
function loadTodos() {
    todoTableBody.innerHTML = '';
    todos.forEach((todo, index) => {
        const row = `
      <tr>
        <td>${todo.title}</td>
        <td>${todo.description}</td>
        <td>${todo.due_date}</td>
        <td>${todo.priority}</td>
        <td>${todo.status}</td>
        <td>
        <button onclick="editTodo(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteTodo(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
        todoTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New todo
function createTodo() {
    if (!validateForm()) return;

    const newTodo = {
        id: Date.now(),
        title: titleInput.value,
        description: descriptionInput.value,
        due_date: due_dateInput.value,
        priority: priorityInput.value,
        status: statusInput.value,
    };
    console.log("Saving new todo", newTodo);
    todos.push(newTodo);
    resetForm();
    loadTodos();
    hideAlert();
}

// Update: Update Existing todo
function updateTodo() {
    if (!validateForm()) return;

    const id = todoIdHiddenInput.value;
    const index = todos.findIndex(todo => todo.id == id);

    if (index !== -1) {
        todos[index] = {
            id: id,
            title: titleInput.value,
            description: descriptionInput.value,
            due_date: due_dateInput.value,
            priority: priorityInput.value,
            status: statusInput.value,
        };
    }

    resetForm();
    loadTodos();
    hideAlert();
}

// Delete: Remove a todo
function deleteTodo(index) {
    todos.splice(index, 1);
    loadTodos();
    hideAlert();
}

// Edit: Populate Form with todo Data for Editing
function editTodo(index) {
    const todo = todos[index];
    console.log(todo);
    todoIdHiddenInput.value = todo.id;
    titleInput.value = todo.title;
    descriptionInput.value = todo.description;
    due_dateInput.value = todo.due_date;
    priorityInput.value = todo.priority;
    statusInput.value = todo.status;
}

// Reset Form
function resetForm() {
    todoIdHiddenInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    due_dateInput.value = '';
    priorityInput.value = '';
    statusInput.value = '';

    titleInput.classList.remove('input-error');
    due_dateInput.classList.remove('input-error');
}

// Form Submission Handler
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (todoIdHiddenInput.value) {
        updateTodo();
    } else {
        createTodo();
    }
});

// Initial Load
loadTodos();
