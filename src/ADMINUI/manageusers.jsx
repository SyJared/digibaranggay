import React, { useEffect, useState } from "react";

function Manageusers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  return (
    <div className="mu">
      {error && <p>{error}</p>}

      {users.map(user => {
        const isExpanded = expandedUserId === user.id;

        return (
          <div
            key={user.id}
            className={`users cursor-pointer ${isExpanded ?'' :'hover:translate-0.5 transition-all duration-300'} `}
            onClick={() => toggleExpand(user.id)}
          >
            <div className="font-medium">{user.firstname} {user.middlename} {user.lastname}</div>
            <div>{user.address}</div>

            {/* Expandable section */}
            <div className={`expand  ${ isExpanded ? "max-h-70 opacity-100" : "max-h-0 opacity-0"}`}>
    <div className="p-3">
      <div>{user.email}</div>
      <div>{user.password}</div>
      <div>{user.address}</div>
      <div>{user.birthdate}</div>
      <div className="buttons">
        <button className="editb">Edit</button>
        <button className="deleteb">Delete</button>
      </div>
    </div>
  </div>
          </div>
        );
      })}
    </div>
  );
}

export default Manageusers;
