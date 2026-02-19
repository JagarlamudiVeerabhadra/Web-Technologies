let students = [];

// Load JSON using Fetch API
function loadStudents() {
    fetch("students.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error loading JSON file.");
            }
            return response.json(); // Parse JSON
        })
        .then(data => {
            students = data;
            displayStudents();
        })
        .catch(error => {
            showMessage("JSON Parsing / Fetch Error!", "red");
            console.error(error);
        });
}

// Display Students (READ)
function displayStudents() {
    let tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        showMessage("No student records found.", "red");
        return;
    }

    students.forEach(student => {
        let row = tbody.insertRow();

        row.insertCell(0).innerText = student.id;
        row.insertCell(1).innerText = student.name;
        row.insertCell(2).innerText = student.course;
        row.insertCell(3).innerText = student.marks;
    });

    showMessage("Student records loaded successfully!", "green");
}

// Validation
function validateInput(id, name, course, marks) {
    if (!id || !name || !course || marks === "") {
        showMessage("All fields are required!", "red");
        return false;
    }

    if (marks < 0 || marks > 100) {
        showMessage("Marks must be between 0 and 100.", "red");
        return false;
    }

    return true;
}

// CREATE
function addStudent() {
    let id = parseInt(document.getElementById("stuId").value);
    let name = document.getElementById("stuName").value;
    let course = document.getElementById("stuCourse").value;
    let marks = parseInt(document.getElementById("stuMarks").value);

    if (!validateInput(id, name, course, marks)) return;

    // Prevent duplicate ID
    if (students.some(s => s.id === id)) {
        showMessage("Student ID already exists!", "red");
        return;
    }

    students.push({ id, name, course, marks });
    displayStudents();
    showMessage("Student added successfully!", "green");
}

// UPDATE
function updateStudent() {
    let id = parseInt(document.getElementById("stuId").value);
    let course = document.getElementById("stuCourse").value;
    let marks = document.getElementById("stuMarks").value;

    let student = students.find(s => s.id === id);

    if (!student) {
        showMessage("Student not found!", "red");
        return;
    }

    if (course) student.course = course;
    if (marks !== "") student.marks = parseInt(marks);

    displayStudents();
    showMessage("Student updated successfully!", "green");
}

// DELETE
function deleteStudent() {
    let id = parseInt(document.getElementById("stuId").value);

    let index = students.findIndex(s => s.id === id);

    if (index === -1) {
        showMessage("Student not found!", "red");
        return;
    }

    students.splice(index, 1);
    displayStudents();
    showMessage("Student deleted successfully!", "green");
}

// Message display
function showMessage(msg, color) {
    let message = document.getElementById("message");
    message.innerText = msg;
    message.style.color = color;
}

// Load data on page load
window.onload = loadStudents;
