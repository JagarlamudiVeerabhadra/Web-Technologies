import React, { useState } from "react";

function UserForm() {
  // State for inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // Validation function
  const validate = () => {
    let newErrors = {};

    if (!name) newErrors.name = "Name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      alert("Form submitted successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setErrors({});
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>
        
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={name}
            onChange={handleChange}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default UserForm;