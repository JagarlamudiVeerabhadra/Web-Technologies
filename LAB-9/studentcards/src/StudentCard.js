import React from "react";

function StudentCard(props) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "15px",
      margin: "10px",
      width: "200px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2>{props.name}</h2>
      <p><strong>Department:</strong> {props.department}</p>
      <p><strong>Marks:</strong> {props.marks}</p>
    </div>
  );
}

export default StudentCard;