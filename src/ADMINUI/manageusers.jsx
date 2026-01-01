import React, { useEffect, useState } from "react";
import "./adhome.css";
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
            className={`users cursor-pointer ${isExpanded ?'' :'hover:translate-y-1 transition-all duration-300'} `}
            onClick={() => toggleExpand(user.id)}
          >
            
            <div className="firstname">{user.firstname} {user.middlename} {user.lastname}</div>
            <div className="place">{user.address}</div>
            
            {/* Expandable section */}
            <div className={`expand  ${ isExpanded ? "max-h-70 opacity-100" : "max-h-0 opacity-0"}`}>
    <div className="w-100 mt-2 text-slate-500">
      <div className="accinfo"><span className="">Email :</span><span>{user.email}</span></div>
      <div className="accinfo"><span>Password :</span><span>{user.password}</span></div>
      <div className="accinfo"><span>Address :</span><span>{user.address}</span></div>
      <div className="accinfo"><span>Birthdate :</span><span>{user.birthdate}</span></div>
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
