import { useEffect, useState } from "react"

function Requestees(){
const [message, setMessage] = useState('');
const [error, setError] = useState('');
const [users, setUsers] = useState([]);
  
  useEffect(() => {
      fetch("http://localhost/digibaranggay/requestees.php")
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data.length > 0) {
            setUsers(result.data);
            setError("");
            
          } else {
            setError("No data found");
          }
          
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch data");
          
        });
    }, []);

  return(<>
    <div className="filters">
      <button>KKID Card</button>
      <button>Proof of residency</button>
      <button>Brgy. Clearance</button>
      <button>Certifcate of indigency</button>
      <button>Sedula</button>
      <button>First job seeker</button>
    </div>
    <div className="requestees">
      {message && <p>{message}</p>}
      {users.map(user => {
        return(
          <div className="users">
            <div className=" font-bold text-green-700">{user.transaction} </div>
            <div>{user.name}</div>
            <div>{user.date}</div>
          </div>
        )
      })}
    </div>
    </>
  )
}
export default Requestees