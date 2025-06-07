if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// DOM Elements
const booksForm = document.getElementById("booksForm");
const booksTableBody = document.getElementById("booksTableBody");
const booksIdHiddenInput = document.getElementById("booksId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const publicationInput = document.getElementById("publication");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");

// Base API URL
const API_URL = "http://localhost:3000/books";

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
  hideAlert(); // Clear previous alerts
  let isValid = true;
  let errors = [];

  if (!titleInput.value.trim()) {
    isValid = false;
    errors.push("Title is required.");
    titleInput.classList.add("input-error");
  } else {
    titleInput.classList.remove("input-error");
  }

  if (!authorInput.value.trim()) {
    isValid = false;
    errors.push("Author is required.");
    authorInput.classList.add("input-error");
  } else {
    authorInput.classList.remove("input-error");
  }

  if (!genreInput.value.trim()) {
    isValid = false;
    errors.push("Genre is required.");
    genreInput.classList.add("input-error");
  } else {
    genreInput.classList.remove("input-error");
  }

  if (!isValid) {
    showAlert(errors.join(" "));
  }
  return isValid;
}

// Load Books from API
async function loadBooks() {
  try {
    const response = await secureFetch(API_URL);
    const data = await response.json();
    booksTableBody.innerHTML = "";
    data.forEach((book) => {
      book.id = book.$loki;
      const row = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.publication}</td>
        <td>${book.status}</td>
        <td>
        <button onclick="editBook(${index})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteBook(${index})" class="btn btn-sm btn-error">Delete</button>
        </td>
      </tr>
    `;
      booksTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    showAlert("Failed to load books.");
    console.error(error);
  }
}

// Create a New Book via API
async function createBook() {
  if (!validateForm()) return;

  const newBook = {
    id: Date.now(),
    title: titleInput.value,
    author: authorInput.value,
    genre: genreInput.value,
    publication: publicationInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };
  try {
    const response = await secureFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error("Failed to create book.");
    }

    resetForm();
    loadBooks();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Update Existing book via API
async function updateBook() {
  if (!validateForm()) return;

  const id = booksIdHiddenInput.value;
  const updatedBook = {
    title: titleInput.value,
    author: authorInput.value,
    genre: genreInput.value,
    publication: publicationInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };

  try {
    const response = await secureFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
      throw new Error("Failed to update book.");
    }

    resetForm();
    loadBooks();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Delete Books via API
async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const response = await secureFetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete book.");
    }

    loadBooks();
    hideAlert();
  } catch (error) {
    showAlert(error.message);
  }
}

// Edit Book: Fetch Data by ID and Populate Form
async function editBook(id) {
  try {
    const response = await secureFetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load book.");
    }

    const book = await response.json();
    book.id = book.$loki;

    booksIdHiddenInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre;
    publicationInput.value = book.publication;
    statusInput.value = book.status || "";
    notesInput.value = book.notes || "";
  } catch (error) {
    showAlert(error.message);
  }
}

// Reset Form
function resetForm() {
  booksIdHiddenInput.value = "";
  titleInput.value = "";
  authorInput.value = "";
  genreInput.value = "";
  publicationInput.value = "";
  statusInput.value = "";
  notesInput.value = "";

  titleInput.classList.remove("input-error");
  authorInput.classList.remove("input-error");
  genreInput.classList.remove("input-error");
}

// Form Submission Handler
booksForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (booksIdHiddenInput.value) {
    updateBook();
  } else {
    createBook();
  }
});

// Initial Load
loadBooks();
