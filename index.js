// Selecting elements
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const isbnInput = document.getElementById("isbn");
const bookList = document.getElementById("book-list");

// Book Class
class Book {
    constructor(title, author, publisher, isbn) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.isbn = isbn;
    }
}

// UI Class
class UI {
    static addToBookList(book) {
        let list = document.getElementById("book-list");
        let row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
        UI.storeBooksInLocalStorage(book);
    }

    static clearFields() {
        titleInput.value = "";
        authorInput.value = "";
        publisherInput.value = "";
        isbnInput.value = "";
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.innerText = message;
        let container = document.querySelector(".container");
        let form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
            UI.showAlert("Book Removed", "success");
            UI.removeBook(el.parentElement.previousElementSibling.textContent.trim());
        }
    }

    static storeBooksInLocalStorage(book) {
        let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
        books = books.filter(book => book.isbn !== isbn);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBooks() {
        let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
        books.forEach(book => UI.addToBookList(book));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if  (
        titleInput.value === "" ||
        authorInput.value === "" ||
        publisherInput.value === "" ||
        isbnInput.value === ""
    ) {
        UI.showAlert("Please fill in all fields", "danger");
    } else {
        // Instantiate book
        const book = new Book(titleInput.value, authorInput.value, publisherInput.value, isbnInput.value);
        
        // Add book to UI
        UI.addToBookList(book);

        // Show success message
        UI.showAlert("Book Added", "success");

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Book
bookList.addEventListener('click', (e) => {
    UI.deleteBook(e.target);
});
