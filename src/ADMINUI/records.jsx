import { useEffect, useState } from "react"

function Records(){
const [users, setUsers]= useState([]);
const [message, setMessage] = useState('');
  useEffect(()=>{
    fetch("http://localhost/digibaranggay/requestees.php").then(res =>res.json())
    .then(result => {
      if(result.success === true && result.data.length > 0){
        setUsers(result.data);
        console.log(users)
    }else{
      setMessage('User does not have a request')
    }
    }).catch(err => setMessage('Failed to fetch data'))
  },[])

  const statusBorder = {
    Approved : 'border-emerald-600',
    Pending : 'border-orange-400',
    Rejected : 'border-rose-600'
  };
  const statusText = {
    Approved : 'text-emerald-700 bg-emerald-100',
    Pending : 'text-orange-700 bg-orange-100',
    Rejected : 'text-rose-700 bg-rose-100'
  }
  
  return(
   <div className="records-div">
    {message && <p>{message}</p>}
  {users.map(u => {
    
    return (
      <div className={`record-info ${statusBorder[u.status]}`}>
        <h2 className="text-lg font-semibold text-emerald-900">
          {u.transaction}
        </h2>

        <span className="text-slate-500 text-sm">
          {u.name}
        </span>

        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusText[u.status]} `}>
          {u.status}
        </span>
      </div>
    )
  })}
</div>

  )
}
export default Records