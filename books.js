// books.js
if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
}  

// DOM Elements
const booksForm = document.getElementById('booksForm');
const booksTableBody = document.getElementById('booksTableBody');
const booksIdHiddenInput = document.getElementById('booksId');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const publicationInput = document.getElementById('publication');
const statusInput = document.getElementById('status');
const notesInput = document.getElementById('notes')
// Alert Box
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// State(like in memory db)
let books = [];

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

    // Title is required
    if (!titleInput.value.trim()) {
        isValid = false;
        errors.push("Title is required.");
        titleInput.classList.add('input-error');
    } else {
        titleInput.classList.remove('input-error');
    }

    // Author is required
    if (!authorInput.value.trim()) {
        isValid = false;
        errors.push("Author is required.");
        authorInput.classList.add('input-error');
    } else {
        authorInput.classList.remove('input-error');
    }

    // Genre is required
    if (!genreInput.value.trim()) {
        isValid = false;
        errors.push("Genre is required.");
        genreInput.classList.add('input-error');
    } else {
        genreInput.classList.remove('input-error');
    }
    //Notes is optional

    if (!isValid) {
        showAlert(errors.join(' '));
    }

    return isValid;
}

// Read: Load Books
function loadBooks() {
    booksTableBody.innerHTML = '';
    books.forEach((book, index) => {
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
        booksTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Create: Add a New Book
function createBook() {
    if (!validateForm()) return;

    const newBook = {
        id: Date.now(),
        title: titleInput.value,
        author: authorInput.value,
        genre: genreInput.value,
        publication: publicationInput.value,
        status: statusInput.value,
        notes: notesInput.value
    };
    console.log("Saving new book", newBook);
    books.push(newBook);
    resetForm();
    loadBooks();
    hideAlert();
}

// Update: Update Existing book
function updateBook() {
    if (!validateForm()) return;

    const id = booksIdHiddenInput.value;
    const index = books.findIndex(book => book.id == id);

    if (index !== -1) {
        books[index] = {
            id: id,
            title: titleInput.value,
            author: authorInput.value,
            genre: genreInput.value,
            publication: publicationInput.value,
            status: statusInput.value,
            notes: notesInput.value
        };
    }

    resetForm();
    loadBooks();
    hideAlert();
}

// Delete: Remove a Books
function deleteBook(index) {
    books.splice(index, 1);
    loadBooks();
    hideAlert();
}

// Edit: Populate Form with Books Data for Editing
function editBook(index) {
    const book = books[index];
    console.log(book);
    booksIdHiddenInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre;
    publicationInput.value = book.publication;
    statusInput.value = book.status;
    notesInput.value = book.notes;
}

// Reset Form
function resetForm() {
    booksIdHiddenInput.value = '';
    titleInput.value = '';
    authorInput.value = '';
    genreInput.value = '';
    publicationInput.value = '';
    statusInput.value = '';
    notesInput.value = '';

    titleInput.classList.remove('input-error');
    authorInput.classList.remove('input-error');
    genreInput.classList.remove('input-error');
}

// Form Submission Handler
booksForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (booksIdHiddenInput.value) {
        updateBook();
    } else {
        createBook();
    }
});

// Initial Load
loadBooks();
