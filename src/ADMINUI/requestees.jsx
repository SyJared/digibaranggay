import { useEffect, useState } from "react"

function Requestees(){
const [message, setMessage] = useState('');
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
            setMessage(result.message)
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
        }else{
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

  const filteredPending = users.filter(user => (!filter || user.transaction === filter) && user.status === 'Pending');
  const selectedUser =users.find(u=> u.id === active?.id && u.transaction === active?.transaction)

  return(<>
    <div className="filters">
  {["KKID Card","Proof of residency","Brgy. Clearance","Certificate of indigency","Sedula","First job seeker"].map(item => (
    <button key={item}
      className={`transition-all duration-200 ${
        filter === item ? 'primary-color text-white' : 'bg-emerald-200 text-green-800'}`}
        onClick={() => setFilter(item)}>
      {item}
    </button>
  ))}
  {filter && <button className="showall"onClick={() => setFilter("")}>
    Show All
  </button>}
</div>
    <div className="requestees-container">
    <div className="requestees no-scrollbar">
      
      {filteredPending.length === 0 ? 
      <p className="flex mx-auto my-auto text-gray-500 text-center">
    {filter ? `There are no pending ${filter} requests`: 'There are no pending requests'}
    </p> 
      :filteredPending.map(user => {
        const isActive = active?.id === user.id && active?.transaction === user.transaction;
        return(
          <div className={`users whitespace-nowrap ${isActive ? 'bg-emerald-100 translate-x-2' 
          : 'bg-gray-50' }`} onClick={()=>toggleActive(user.id, user.transaction)}>
            <div>
              <div className=" font-semibold primary-color-text">{user.transaction} </div>
              <div >{user.name}</div>
            </div>
            <div className="text-gray-500">{user.date}</div>
            
          </div>
        )
      }) }
    </div>
    <div className="approvereject ">
  {selectedUser ? (
    <div className="flex flex-col gap-4">

      <h2 className="text-2xl md:text-3xl font-semibold text-emerald-800 border-b-2 pb-2">
        {selectedUser.transaction}
      </h2>

      <div className="border-orange-400 text-orange-700 bg-orange-100 w-fit px-3 border-2 rounded-2xl">{selectedUser.status}</div>
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
        <p id="purpose" className="bg-white p-3 rounded-md text-gray-800">
          {selectedUser.purpose}
        </p>
      </div>

      <div className="mt-4 flex gap-4 relative">
        <button className="flex-1 bg-green-800 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition active:scale-95" onClick={()=>handleClick(selectedUser.id, selectedUser.transaction, 'Approved')}>
          Approve
        </button>
        <button className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition active:scale-95"
         onClick={()=>handleClick(selectedUser.id, selectedUser.transaction, 'Rejected')}>
          Reject
        </button>
      </div>
       {message && <p className="text-emerald-700 text-sm font-medium">{message}</p>}
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