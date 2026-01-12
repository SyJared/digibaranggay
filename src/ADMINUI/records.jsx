import { useEffect, useState } from "react"

function Records(){
const [users, setUsers]= useState([]);
const [message, setMessage] = useState('');
const [active, setActive] = useState({id: null, transaction: null});
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
  const toggleActive = (id, transaction)=> {
    if(active?.id === id && active?.transaction === transaction){
      setActive(null)
    }else{
      setActive({id, transaction})
    }
  }

  const formatDate =(time)=>{
    const date = new Date(time);
    return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  }
  
  return(
   <div className="records-div">
    {message && <p>{message}</p>}
  {users.map(u => {
    const isActive = active?.id === u.id && active?.transaction === u.transaction;
    return (
      <div className={`record-info ${statusBorder[u.status]} ${isActive ? 'max-h-30' : 'max-h-15'}`} onClick={()=>toggleActive(u.id, u.transaction)}>
      <div className="grid grid-cols-2 w-full" >
        <div>
          <h2 className="text-lg font-semibold text-emerald-900">{u.transaction}</h2>
          <span className="text-slate-500 text-sm">
            {u.name}
          </span>
        </div>

        <div className="justify-self-end content-center "><span className={` px-3 py-1 rounded-2xl text-sm font-semibold ${statusText[u.status]} `}>
          {u.status}
        </span>
        </div>  
      </div>
      <div className={`${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div>{formatDate(u.date)}</div>
      </div>
      </div>
    )
  })}
</div>

  )
}
export default Records