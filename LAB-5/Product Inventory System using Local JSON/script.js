let products = [];

// Load JSON using Fetch API
function loadProducts() {
    fetch("inventory.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load JSON.");
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts();
        })
        .catch(error => {
            showMessage("Error loading or parsing JSON!", "red");
            console.error(error);
        });
}

// Display Products
function displayProducts(filteredList = null) {
    let tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";

    let list = filteredList || products;

    let totalInventoryValue = 0;

    list.forEach(product => {
        let row = tbody.insertRow();

        if (product.stock < 5) {
            row.classList.add("low-stock"); // Conditional formatting
        }

        row.insertCell(0).innerText = product.id;
        row.insertCell(1).innerText = product.name;
        row.insertCell(2).innerText = product.category;
        row.insertCell(3).innerText = product.price;
        row.insertCell(4).innerText = product.stock;

        let totalValue = product.price * product.stock;
        row.insertCell(5).innerText = totalValue;

        totalInventoryValue += totalValue;
    });

    document.getElementById("totalValue").innerText =
        "Total Inventory Value: ₹ " + totalInventoryValue;

    showMessage("Inventory updated successfully!", "green");
}

// Validation
function validateInput(id, name, category, price, stock) {
    if (!id || !name || !category || price === "" || stock === "") {
        showMessage("All fields are required!", "red");
        return false;
    }

    if (price <= 0 || stock < 0) {
        showMessage("Invalid price or stock value!", "red");
        return false;
    }

    return true;
}

// ADD
function addProduct() {
    let id = parseInt(document.getElementById("prodId").value);
    let name = document.getElementById("prodName").value;
    let category = document.getElementById("prodCategory").value;
    let price = parseFloat(document.getElementById("prodPrice").value);
    let stock = parseInt(document.getElementById("prodStock").value);

    if (!validateInput(id, name, category, price, stock)) return;

    if (products.some(p => p.id === id)) {
        showMessage("Product ID already exists!", "red");
        return;
    }

    products.push({ id, name, category, price, stock });
    displayProducts();
    showMessage("Product added successfully!", "green");
}

// UPDATE
function updateProduct() {
    let id = parseInt(document.getElementById("prodId").value);
    let price = document.getElementById("prodPrice").value;
    let stock = document.getElementById("prodStock").value;

    let product = products.find(p => p.id === id);

    if (!product) {
        showMessage("Product not found!", "red");
        return;
    }

    if (price !== "") product.price = parseFloat(price);
    if (stock !== "") product.stock = parseInt(stock);

    displayProducts();
    showMessage("Product updated successfully!", "green");
}

// DELETE
function deleteProduct() {
    let id = parseInt(document.getElementById("prodId").value);

    let index = products.findIndex(p => p.id === id);

    if (index === -1) {
        showMessage("Product not found!", "red");
        return;
    }

    products.splice(index, 1);
    displayProducts();
    showMessage("Product deleted successfully!", "green");
}

// SEARCH
function searchCategory() {
    let category = document.getElementById("searchCategory").value.toLowerCase();

    if (!category) {
        showMessage("Enter category to search!", "red");
        return;
    }

    let filtered = products.filter(p =>
        p.category.toLowerCase().includes(category)
    );

    if (filtered.length === 0) {
        showMessage("No products found in this category.", "red");
    }

    displayProducts(filtered);
}

// Message
function showMessage(msg, color) {
    let message = document.getElementById("message");
    message.innerText = msg;
    message.style.color = color;
}

// Load on page start
window.onload = loadProducts;
