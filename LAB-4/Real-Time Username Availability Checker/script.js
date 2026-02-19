const usernameInput = document.getElementById("username");
const message = document.getElementById("message");
const form = document.getElementById("registerForm");

let isUsernameAvailable = false;

usernameInput.addEventListener("input", function () {

    const username = usernameInput.value.trim();

    if (username === "") {
        message.textContent = "";
        return;
    }

    // Show loading message
    message.textContent = "Checking...";
    message.className = "loading";

    // Simulate AJAX request using Fetch API
    fetch("users.json")
        .then(response => response.json())
        .then(data => {

            const existingUsers = data.usernames;

            if (existingUsers.includes(username.toLowerCase())) {
                message.textContent = "Username already taken";
                message.className = "taken";
                isUsernameAvailable = false;
            } else {
                message.textContent = "Username available";
                message.className = "available";
                isUsernameAvailable = true;
            }
        })
        .catch(error => {
            message.textContent = "Error checking username";
            message.className = "taken";
            isUsernameAvailable = false;
        });
});

form.addEventListener("submit", function (e) {
    if (!isUsernameAvailable) {
        e.preventDefault();
        alert("Please choose a different username.");
    }
});
