let xmlDoc;

// Load XML File
function loadXML(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                xmlDoc = xhr.responseXML;

                if (!xmlDoc) {
                    showMessage("Malformed XML File!", "red");
                    return;
                }

                callback();
            } else {
                showMessage("Error loading XML file.", "red");
            }
        }
    };
    xhr.send();
}

// Display Employees
function displayEmployees() {
    let tableBody = document.querySelector("#empTable tbody");
    tableBody.innerHTML = "";

    let employees = xmlDoc.getElementsByTagName("employee");

    if (employees.length == 0) {
        showMessage("No employees found.", "red");
        return;
    }

    for (let i = 0; i < employees.length; i++) {
        let row = tableBody.insertRow();

        row.insertCell(0).innerText =
            employees[i].getElementsByTagName("id")[0].textContent;

        row.insertCell(1).innerText =
            employees[i].getElementsByTagName("name")[0].textContent;

        row.insertCell(2).innerText =
            employees[i].getElementsByTagName("department")[0].textContent;

        row.insertCell(3).innerText =
            employees[i].getElementsByTagName("salary")[0].textContent;
    }

    showMessage("Employees loaded successfully!", "green");
}

// Add Employee
function addEmployee() {
    loadXML(function () {

        let id = document.getElementById("empId").value;
        let name = document.getElementById("empName").value;
        let dept = document.getElementById("empDept").value;
        let salary = document.getElementById("empSalary").value;

        if (!id || !name || !dept || !salary) {
            showMessage("All fields are required!", "red");
            return;
        }

        let employee = xmlDoc.createElement("employee");

        let idNode = xmlDoc.createElement("id");
        idNode.textContent = id;

        let nameNode = xmlDoc.createElement("name");
        nameNode.textContent = name;

        let deptNode = xmlDoc.createElement("department");
        deptNode.textContent = dept;

        let salaryNode = xmlDoc.createElement("salary");
        salaryNode.textContent = salary;

        employee.appendChild(idNode);
        employee.appendChild(nameNode);
        employee.appendChild(deptNode);
        employee.appendChild(salaryNode);

        xmlDoc.getElementsByTagName("employees")[0].appendChild(employee);

        displayEmployees();
        showMessage("Employee added successfully!", "green");
    });
}

// Update Employee
function updateEmployee() {
    loadXML(function () {

        let id = document.getElementById("empId").value;
        let dept = document.getElementById("empDept").value;
        let salary = document.getElementById("empSalary").value;

        let employees = xmlDoc.getElementsByTagName("employee");
        let found = false;

        for (let i = 0; i < employees.length; i++) {
            let empId = employees[i].getElementsByTagName("id")[0].textContent;

            if (empId == id) {
                if (dept)
                    employees[i].getElementsByTagName("department")[0].textContent = dept;

                if (salary)
                    employees[i].getElementsByTagName("salary")[0].textContent = salary;

                found = true;
                break;
            }
        }

        if (found) {
            displayEmployees();
            showMessage("Employee updated successfully!", "green");
        } else {
            showMessage("Employee not found!", "red");
        }
    });
}

// Delete Employee
function deleteEmployee() {
    loadXML(function () {

        let id = document.getElementById("empId").value;
        let employees = xmlDoc.getElementsByTagName("employee");
        let found = false;

        for (let i = 0; i < employees.length; i++) {
            let empId = employees[i].getElementsByTagName("id")[0].textContent;

            if (empId == id) {
                employees[i].parentNode.removeChild(employees[i]);
                found = true;
                break;
            }
        }

        if (found) {
            displayEmployees();
            showMessage("Employee deleted successfully!", "green");
        } else {
            showMessage("Employee not found!", "red");
        }
    });
}

// Show Messages
function showMessage(msg, color) {
    let message = document.getElementById("message");
    message.innerText = msg;
    message.style.color = color;
}

// Load employees on page load
window.onload = function () {
    loadXML(displayEmployees);
};
