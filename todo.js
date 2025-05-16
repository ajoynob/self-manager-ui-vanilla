// todo.js
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const todoForm = document.getElementById("todoForm");
const todoTableBody = document.getElementById("todoTableBody");
const todoIdHiddenInput = document.getElementById("todoId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const due_dateInput = document.getElementById("due_date");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/todos";

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
  hideAlert();
  let isValid = true;
  let errors = [];

  if (!titleInput.value.trim()) {
    isValid = false;
    errors.push("title is required.");
    titleInput.classList.add("input-error");
  } else {
    titleInput.classList.remove("input-error");
  }

  if (!due_dateInput.value.trim()) {
    isValid = false;
    errors.push("Due date is required.");
    due_dateInput.classList.add("input-error");
  } else {
    due_dateInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }

  return isValid;
}

// Load todos from API
async function loadTodos() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    todoTableBody.innerHTML = "";
    data.forEach((todo) => {
      todo.id = todo.$loki;
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
      todoTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load groceries.");
    console.error(error);
  }
}

// Create a New todo via API
async function createTodo() {
  if (!validateForm()) return;

  const newTodo = {
    id: Date.now(),
    title: titleInput.value,
    description: descriptionInput.value,
    due_date: due_dateInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo.");
    }

    resetForm();
    loadTodos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing todo via API
async function updateTodo() {
  if (!validateForm()) return;

  const id = todoIdHiddenInput.value;
  const updatedTodo = {
    title: titleInput.value,
    description: descriptionInput.value,
    due_date: due_dateInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
  };
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo.");
    }

    resetForm();
    loadTodos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete todo via API
async function deleteTodo(id) {
  if (!confirm("Are you sure you want to delete this todo?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete todo.");
    }

    loadTodos();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}
// Edit Todo: Fetch Data by ID and Populate Formg
async function editTodo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load todo.");
    }

    const todo = await response.json();
    todo.id = todo.$loki;

    todoIdHiddenInput.value = todo.id;
    titleInput.value = todo.title;
    descriptionInput.value = todo.description;
    due_dateInput.value = todo.due_date;
    priorityInput.value = todo.priority || "";
    statusInput.value = todo.status || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  todoIdHiddenInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  due_dateInput.value = "";
  priorityInput.value = "";
  statusInput.value = "";

  titleInput.classList.remove("input-error");
  due_dateInput.classList.remove("input-error");
}

// Form Submission Handler
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (todoIdHiddenInput.value) {
    updateTodo();
  } else {
    createTodo();
  }
});

// Initial Load
loadTodos();
