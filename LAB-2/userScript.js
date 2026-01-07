function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validations
    if (!name || !email || !mobile || !password) {
        alert("All fields are mandatory");
        return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Mobile number must be 10 digits");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    let users = getUsers();

    // Duplicate email check
    if (users.some(user => user.email === email)) {
        alert("Email already registered");
        return;
    }

    users.push({ name, email, mobile, password });
    saveUsers(users);

    document.getElementById("registerForm").reset();
    displayUsers();
}

function displayUsers() {
    const users = getUsers();
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach((user, index) => {
        table.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${user.password}</td>
                <td>
                    <button onclick="deleteUser(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteUser(index) {
    let users = getUsers();
    users.splice(index, 1);
    saveUsers(users);
    displayUsers();
}

function clearAllUsers() {
    if (confirm("Are you sure you want to delete all users?")) {
        localStorage.removeItem("users");
        displayUsers();
    }
}

// Load users on page refresh
displayUsers();
