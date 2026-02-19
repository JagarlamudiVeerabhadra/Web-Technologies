let xmlDoc;

// Load XML using AJAX GET
function loadXML(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                xmlDoc = xhr.responseXML;

                if (!xmlDoc) {
                    showMessage("Malformed XML file!", "red");
                    return;
                }

                callback();
            } else {
                showMessage("Error loading XML file!", "red");
            }
        }
    };
    xhr.send();
}

// Display Books
function displayBooks() {
    let tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    let books = xmlDoc.getElementsByTagName("book");

    if (books.length === 0) {
        showMessage("No books available.", "red");
        return;
    }

    for (let i = 0; i < books.length; i++) {
        let row = tbody.insertRow();

        row.insertCell(0).innerText =
            books[i].getElementsByTagName("id")[0].textContent;

        row.insertCell(1).innerText =
            books[i].getElementsByTagName("title")[0].textContent;

        row.insertCell(2).innerText =
            books[i].getElementsByTagName("author")[0].textContent;

        row.insertCell(3).innerText =
            books[i].getElementsByTagName("status")[0].textContent;
    }

    showMessage("Book list refreshed successfully!", "green");
}

// Validation
function validateInputs(id, title, author, status) {
    if (!id) {
        showMessage("Book ID is required!", "red");
        return false;
    }
    return true;
}

// Add Book
function addBook() {
    loadXML(function () {

        let id = document.getElementById("bookId").value;
        let title = document.getElementById("bookTitle").value;
        let author = document.getElementById("bookAuthor").value;
        let status = document.getElementById("bookStatus").value;

        if (!validateInputs(id, title, author, status)) return;
        if (!title || !author || !status) {
            showMessage("All fields must be filled!", "red");
            return;
        }

        let books = xmlDoc.getElementsByTagName("book");

        // Prevent duplicate ID
        for (let i = 0; i < books.length; i++) {
            let existingId =
                books[i].getElementsByTagName("id")[0].textContent;
            if (existingId === id) {
                showMessage("Book ID already exists!", "red");
                return;
            }
        }

        let book = xmlDoc.createElement("book");

        let idNode = xmlDoc.createElement("id");
        idNode.textContent = id;

        let titleNode = xmlDoc.createElement("title");
        titleNode.textContent = title;

        let authorNode = xmlDoc.createElement("author");
        authorNode.textContent = author;

        let statusNode = xmlDoc.createElement("status");
        statusNode.textContent = status;

        book.appendChild(idNode);
        book.appendChild(titleNode);
        book.appendChild(authorNode);
        book.appendChild(statusNode);

        xmlDoc.getElementsByTagName("library")[0].appendChild(book);

        displayBooks();
        showMessage("Book added successfully!", "green");
    });
}

// Update Availability
function updateBook() {
    loadXML(function () {

        let id = document.getElementById("bookId").value;
        let status = document.getElementById("bookStatus").value;

        if (!id || !status) {
            showMessage("Book ID and Status required!", "red");
            return;
        }

        let books = xmlDoc.getElementsByTagName("book");
        let found = false;

        for (let i = 0; i < books.length; i++) {
            let bookId =
                books[i].getElementsByTagName("id")[0].textContent;

            if (bookId === id) {
                books[i].getElementsByTagName("status")[0].textContent = status;
                found = true;
                break;
            }
        }

        if (found) {
            displayBooks();
            showMessage("Availability updated successfully!", "green");
        } else {
            showMessage("Book not found!", "red");
        }
    });
}

// Delete Book
function deleteBook() {
    loadXML(function () {

        let id = document.getElementById("bookId").value;

        if (!id) {
            showMessage("Book ID required!", "red");
            return;
        }

        let books = xmlDoc.getElementsByTagName("book");
        let found = false;

        for (let i = 0; i < books.length; i++) {
            let bookId =
                books[i].getElementsByTagName("id")[0].textContent;

            if (bookId === id) {
                books[i].parentNode.removeChild(books[i]);
                found = true;
                break;
            }
        }

        if (found) {
            displayBooks();
            showMessage("Book deleted successfully!", "green");
        } else {
            showMessage("Book not found!", "red");
        }
    });
}

// Message Display
function showMessage(msg, color) {
    let message = document.getElementById("message");
    message.innerText = msg;
    message.style.color = color;
}

// Load books when page loads
window.onload = function () {
    loadXML(displayBooks);
};
