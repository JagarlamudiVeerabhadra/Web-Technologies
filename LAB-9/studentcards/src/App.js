import React from "react";
import StudentCard from "./StudentCard."; // ✅ Correct import

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Student Cards</h1>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        
        <StudentCard name="John Doe" department="CSE" marks="85" />
        <StudentCard name="Alice Smith" department="ECE" marks="90" />
        <StudentCard name="Rahul Kumar" department="MECH" marks="78" />
        <StudentCard name="Priya Reddy" department="IT" marks="92" />

      </div>
    </div>
  );
}

export default App;