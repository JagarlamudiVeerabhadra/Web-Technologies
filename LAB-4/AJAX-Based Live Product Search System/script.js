const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const statusText = document.getElementById("status");

let debounceTimer;

// Debounce Function
function debounce(callback, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

searchInput.addEventListener("input", function () {

    const query = searchInput.value.trim().toLowerCase();

    debounce(() => {

        if (query === "") {
            resultsDiv.innerHTML = "";
            statusText.textContent = "";
            return;
        }

        statusText.textContent = "Searching...";
        statusText.className = "loading";

        fetch("products.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {

                const products = data.products;

                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );

                displayResults(filteredProducts);

            })
            .catch(error => {
                statusText.textContent = "Failed to fetch products.";
                statusText.className = "error";
                resultsDiv.innerHTML = "";
            });

    }, 500); // 500ms delay
});

function displayResults(products) {

    resultsDiv.innerHTML = "";
    statusText.textContent = "";

    if (products.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    products.forEach(product => {

        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
        `;

        resultsDiv.appendChild(productDiv);
    });
}
