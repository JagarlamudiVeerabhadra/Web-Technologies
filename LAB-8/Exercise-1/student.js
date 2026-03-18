let studentName = "Arun";
let mark1 = 85;
let mark2 = 90;
let mark3 = 88;

const calculateAverage = (m1, m2, m3) => {
    return (m1 + m2 + m3) / 3;
};

let total = mark1 + mark2 + mark3;
let average = calculateAverage(mark1, mark2, mark3);

document.getElementById("name").textContent = studentName;
document.getElementById("total").textContent = total;
document.getElementById("average").textContent = average.toFixed(2);