let page = 1;

function displayBooks(data){

const container = document.getElementById("books");
container.innerHTML = "";

data.forEach(book => {

container.innerHTML += `
<div class="book">
<h3>${book.title}</h3>
<p>Author: ${book.author}</p>
<p>Category: ${book.category}</p>
<p>Price: ${book.price}</p>
<p>Rating: ${book.rating}</p>
</div>
`;

});
}

function searchBooks(){

const title = document.getElementById("searchTitle").value;

fetch(`/books/search?title=${title}`)
.then(res => res.json())
.then(data => displayBooks(data));

}

function filterCategory(){

const category = document.getElementById("category").value;

fetch(`/books/category/${category}`)
.then(res => res.json())
.then(data => displayBooks(data));

}

function sortPrice(){

fetch(`/books/sort/price`)
.then(res => res.json())
.then(data => displayBooks(data));

}

function sortRating(){

fetch(`/books/sort/rating`)
.then(res => res.json())
.then(data => displayBooks(data));

}

function topRated(){

fetch(`/books/top`)
.then(res => res.json())
.then(data => displayBooks(data));

}

function loadMore(){

fetch(`/books?page=${page}`)
.then(res => res.json())
.then(data => {

const container = document.getElementById("books");

data.forEach(book => {

container.innerHTML += `
<div class="book">
<h3>${book.title}</h3>
<p>${book.author}</p>
<p>${book.category}</p>
<p>${book.price}</p>
<p>${book.rating}</p>
</div>
`;

});

});

page++;

}