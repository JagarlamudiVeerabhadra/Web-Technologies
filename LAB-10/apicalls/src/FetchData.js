import React, { useState, useEffect } from "react";

function FetchData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        // ✅ Modify data into same structure
        const formattedData = result.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company.name
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>User List</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <div style={styles.cardContainer}>
          {data.map(user => (
            <div key={user.id} style={styles.card}>
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Company:</strong> {user.company}</p>
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
    width: "250px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
  },
  error: {
    color: "red"
  }
};

export default FetchData;