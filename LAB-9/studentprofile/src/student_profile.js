import React from "react";

function StudentProfile() {
  const name = "John Doe";
  const department = "Computer Science";
  const year = "3rd Year";
  const section = "A";

  return (
    <div>
      <h1>Student Profile</h1>
      <p>Name: {name}</p>
      <p>Department: {department}</p>
      <p>Year: {year}</p>
      <p>Section: {section}</p>
    </div>
  );
}

export default StudentProfile;