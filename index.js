// Book Class: Repesent a Book:
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks: UI(User Interface)
class UI {
    static displayBooks() {
        const books = store.getBook();

        books.forEach((book) => {
            UI.addBookToList(book)
        });
    }

    static addBookToList(book) {
        const reqList = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        reqList.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(targeted) {
        if (targeted.classList.contains('delete')) {
            targeted.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const parentContainer = document.querySelector('.container');
        const formContainer = document.querySelector('#book-form');
        parentContainer.insertBefore(div, formContainer);

        // Removing the message after 3 seconds
        setTimeout(() => {
            const alertMessage = document.querySelector('.alert');
            alertMessage.remove();
        }, 3000);
    }
}

// Storage Class to handle the storage of information in LocalStorage:
class store {
    // Note that we can not store object in local storage it has to be string.
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        let books = store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        let books = store.getBook();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Displaying the Books:
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Adding a Book after submiting the Form:
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent Actual Submit:
    e.preventDefault();

    // Getting the Form values from HTML:
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Form Validation:
    if (title === '' || author === '' || isbn === '') {
        // alert('Please fill in all the required fields.');
        UI.showAlert('Please fill the required fields', 'danger');
    }
    else {
        // Instatiate the book:
        const printBook = new Book(title, author, isbn);

        // Adding book the UI:
        UI.addBookToList(printBook);

        // Adding book to the local Storage:
        store.addBook(printBook);

        // Show Success Message:
        UI.showAlert('Information sucessfully added', 'success');

        // Clear Fields:
        UI.clearFields();
    }
});

// Removing the Book from the List:
const deleteList = document.querySelector('#book-list');
deleteList.addEventListener('click', (e) => {
    // Removing Book From the UI:
    UI.deleteBook(e.target);

    // Removing Book From the Store:
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show Success Message:
    UI.showAlert('Book Removed', 'success');
});