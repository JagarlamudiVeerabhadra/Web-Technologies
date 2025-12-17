// Cancel button → go back to home page
document.getElementById("cancelBtn").onclick = function () {
    window.location.href = "index.html";
};

// Register button → validate form
document.getElementById("regForm").onsubmit = function (event) {
    event.preventDefault(); // stop form submission

    let name = document.getElementById("name").value.trim();
    let regno = document.getElementById("regno").value.trim();
    let email = document.getElementById("email").value.trim();
    let contact = document.getElementById("contact").value.trim();

    if (name === "") {
        alert("Enter the Name");
        return;
    }
    if (regno === "") {
        alert("Enter the Registration Number");
        return;
    }
    if (email === "") {
        alert("Enter the Email");
        return;
    }
    if (contact.length !== 10 || isNaN(contact)) {
        alert("Contact number must be 10 digits only");
        return;
    }

    alert("Registered Successfully!");
};
