const apiURL = "http://localhost:3000/students";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const message = document.getElementById("message");

const idInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const deptInput = document.getElementById("department");
const marksInput = document.getElementById("marks");

// READ (Fetch Students)
function fetchStudents() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(data => {
            table.innerHTML = "";
            data.forEach(student => {
                addRow(student);
            });
        })
        .catch(error => {
            showMessage("Error fetching students (500)", "error");
        });
}

// CREATE
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const student = {
        id: idInput.value,
        name: nameInput.value,
        department: deptInput.value,
        marks: marksInput.value
    };

    fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
    })
    .then(response => {
        if (response.status === 201 || response.status === 200) {
            showMessage("Student added successfully!", "success");
            fetchStudents();
            form.reset();
        } else {
            throw new Error("Failed to add");
        }
    })
    .catch(() => showMessage("Error adding student (500)", "error"));
});

// UPDATE
function updateStudent(id) {

    const updatedStudent = {
        name: prompt("Enter new name:"),
        department: prompt("Enter new department:"),
        marks: prompt("Enter new marks:")
    };

    fetch(`${apiURL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
    })
    .then(response => {
        if (response.status === 200) {
            showMessage("Student updated successfully!", "success");
            fetchStudents();
        } else if (response.status === 404) {
            showMessage("Student not found (404)", "error");
        } else {
            throw new Error();
        }
    })
    .catch(() => showMessage("Error updating student (500)", "error"));
}

// DELETE
function deleteStudent(id) {
    fetch(`${apiURL}/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.status === 200) {
            showMessage("Student deleted successfully!", "success");
            fetchStudents();
        } else if (response.status === 404) {
            showMessage("Student not found (404)", "error");
        } else {
            throw new Error();
        }
    })
    .catch(() => showMessage("Error deleting student (500)", "error"));
}

// Add Row to Table
function addRow(student) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.department}</td>
        <td>${student.marks}</td>
        <td>
            <button onclick="updateStudent('${student.id}')">Edit</button>
            <button onclick="deleteStudent('${student.id}')">Delete</button>
        </td>
    `;

    table.appendChild(row);
}

function showMessage(msg, type) {
    message.textContent = msg;
    message.className = type;
    setTimeout(() => message.textContent = "", 3000);
}

// Load students on page load
fetchStudents();
