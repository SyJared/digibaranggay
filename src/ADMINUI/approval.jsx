import React, { useEffect, useState } from "react";

function Approval() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);  // new
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost/digibaranggay/showtable.php")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data.length > 0) {
          setUsers(result.data);
          setError("");
        } else {
          setError("No data found");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="approvalbubble">
      {error && <p>{error}</p>}

      {users.map(user => (
        <div key={user.id}>
          <p>{user.firstname} {user.lastname}</p>
          <p>{user.email}</p>

        </div>
      ))}
      <p>test git</p>
      <p>test git</p>
    </div>
  );
}

export default Approval;
