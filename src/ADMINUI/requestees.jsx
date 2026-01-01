import { useEffect, useState } from "react"

function Requestees(){
const [message, setMessage] = useState('');
const [error, setError] = useState('');
const [users, setUsers] = useState([]);
const [active, setActive] = useState(null);
const [filter, setFilter] = useState('');
  
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

    const handleClick = async (id,transaction, status)=>{
      try {
        const res = await fetch("http://localhost/digibaranggay/handlestatus.php",{
          method : 'POST',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            id,
            transaction,
            status
          })
        }
      );
        const data = await res.json();
        if(data.Success === true){
          setMessage(data.message)
        }

      } catch (error) {
        setMessage('failed fetch')
      }
    }

    const toggleActive = (id, transaction)=>{
      if (active?.id === id && active?.transaction === transaction){
        setActive(null);
      }else{
        setActive({id, transaction})
      }
    };

  const selectedUser =users.find(u=> u.id === active?.id && u.transaction === active?.transaction)

  return(<>
    <div className="filters">
  {["KKID Card","Proof of residency","Brgy. Clearance","Certificate of indigency","Sedula","First job seeker"].map(item => (
    <button key={item}
      className={`transition-all duration-200 ${
        filter === item ? 'bg-green-800 text-white' : 'bg-green-200 text-green-800'}`}
        onClick={() => setFilter(item)}>
      {item}
    </button>
  ))}
  {filter && <button className="showall"onClick={() => setFilter("")}>
    Show All
  </button>}
</div>
    <div className="requestees-container">
    <div className="requestees ">
      {error && <p className="flex mx-auto my-auto">{error}</p>}
      {users.filter(user => (!filter || user.transaction === filter) && user.status === 'Pending')
      .map(user => {
        const isActive = active?.id === user.id && active?.transaction === user.transaction;
        return(
          <div className={`users ${isActive ? 'bg-white translate-x-1.5' : 'bg-green-100' }`} onClick={()=>toggleActive(user.id, user.transaction)}>
            <div className=" font-bold text-green-900">{user.transaction} </div>
            <div>{user.name}</div>
            <div>{user.date}</div>
          </div>
        )
      })}
    </div>
    <div className="approvereject ">
  {selectedUser ? (
    <div className="flex flex-col gap-4">

      <h2 className="text-2xl md:text-3xl font-semibold text-emerald-800 border-b-2 pb-2">
        {selectedUser.transaction}
      </h2>


      <div className="flex flex-col gap-2 text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{selectedUser.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Birthdate:</span>
          <span>{selectedUser.birthdate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date Requested:</span>
          <span>{selectedUser.date}</span>
        </div>
      </div>


      <div className="mt-5">
        <label htmlFor="purpose" className="block font-medium text-gray-700 mb-1">
          Purpose of Request
        </label>
        <p id="purpose" className="bg-gray-100 p-3 rounded-md text-gray-800">
          {selectedUser.purpose}
        </p>
      </div>

      <div className="mt-4 flex gap-4 relative">
        <button className="flex-1 bg-green-800 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition" onClick={()=>handleClick(selectedUser.id, selectedUser.transaction, 'Approved')}>
          Approve
        </button>
        <button className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
         onClick={()=>handleClick(selectedUser.id, selectedUser.transaction, 'Rejected')}>
          Reject
        </button>
      </div>
       {message && <p className="text-xs">{message}</p>}
    </div>
  ) : (
    <div className="text-gray-400 text-xl md:text-2xl text-center">
      Select a user
    </div>
    
  )}
</div>
    </div>
    </>
  )
}
export default Requestees