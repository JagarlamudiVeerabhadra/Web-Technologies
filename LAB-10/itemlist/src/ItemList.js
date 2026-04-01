import React, { useState } from "react";

function ItemList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Add item (structured format)
  const addItem = () => {
    if (input.trim() === "") return;

    const newItem = {
      id: Date.now(),
      name: input,      // ✅ consistent naming
      status: "Active"  // ✅ added extra field (same structure idea)
    };

    setItems(prev => [...prev, newItem]);
    setInput("");
  };

  // Remove item
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Item List</h2>

      {/* Input Section */}
      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Enter item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={addItem} style={styles.addBtn}>
          Add
        </button>
      </div>

      {/* Display Section */}
      {items.length === 0 ? (
        <p>No items available</p>
      ) : (
        <div style={styles.cardContainer}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              <button
                onClick={() => removeItem(item.id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px"
  },
  inputBox: {
    marginBottom: "20px"
  },
  input: {
    padding: "8px",
    marginRight: "10px"
  },
  addBtn: {
    padding: "8px 12px"
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    margin: "10px",
    width: "200px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
  },
  removeBtn: {
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default ItemList;