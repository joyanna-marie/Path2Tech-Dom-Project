// Selecting elements
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const isbnInput = document.getElementById("isbn");
const bookList = document.getElementById("book-list");
const API = "https://bookstore-api-six.vercel.app/api/books";

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
    static async displayBooks() {
        try {
            console.log("Fetching books from API...");
            const response = await fetch(API);
            if (!response.ok) throw new Error("Failed to fetch books");

            const books = await response.json();
            console.log("Books fetched successfully:", books);

            UI.renderBooks(books);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }


    static renderBooks(books) {
        bookList.innerHTML = ""; 
        books.forEach((book) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="btn btn-danger btn-sm delete" data-isbn="${book.isbn}">X</a></td>
            `;
            bookList.appendChild(row);
        });
    }

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

    static async addBook(book) {
        try {
            const response = await fetch(API, {
                method: "POST",
                body: JSON.stringify(book),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to add book");

            console.log("Book added successfully.");
            UI.addToBookList(book);
            UI.showAlert("Book Added", "success");
        } catch (error) {
            console.error("Error adding book:", error);
        }
    }


    static async deleteBook(el) {
        if (el.classList.contains("delete")) {
            const isbn = el.getAttribute("data-isbn"); 
            el.parentElement.parentElement.remove(); 
            UI.showAlert("Book Removed", "success");

            try {
                const response = await fetch(`${API}/${isbn}`, { method: "DELETE" });

                if (!response.ok) throw new Error("Failed to delete book");

                console.log("Book deleted successfully.");
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired, calling displayBooks()");
    UI.displayBooks();
    
    // Event: Remove a Book
    bookList.addEventListener('click', (e) => {
        UI.deleteBook(e.target);
    });
});

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
        UI.addBook(book);

        // Show success message
        UI.showAlert("Book Added", "success");

        // Clear fields
        UI.clearFields();
    }
});


