import { useContext, useEffect, useState } from "react"
import { RequestContext } from "../requestList";

function Records(){
const {users, listingMessage, setListingMessage} = useContext(RequestContext);
const [active, setActive] = useState({id: null, transaction: null});
  

  const statusBorder = {
    Approved : 'border-emerald-600',
    Pending : 'border-orange-400',
    Rejected : 'border-rose-600',
    Expired: 'border-gray-500',
  };
  const statusText = {
    Approved : 'text-emerald-700 bg-emerald-100',
    Pending : 'text-orange-700 bg-orange-100',
    Rejected : 'text-rose-700 bg-rose-100',
    Expired: 'text-gray-700 bg-gray-200',
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
   <div className="records-div flex flex-col gap-3">
    {listingMessage && <p>{listingMessage}</p>}
  {users.map(u => {
    const isActive = active?.id === u.id && active?.transaction === u.transaction;
    return (
      <div className={`record-info ${statusBorder[u.status]} overflow-hidden transition-all duration-300`}
      onClick={() => toggleActive(u.id, u.transaction)}
>
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
      <div
  className={`transition-all duration-300 overflow-hidden ${
    isActive ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'
  }`}
>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <span className="font-semibold text-slate-700">Date Requested</span>
          <p>{formatDate(u.date)}</p>
        </div>

        <div>
          <span className="font-semibold text-slate-700">Date Updated</span>
          <p>{formatDate(u.dateupdated)}</p>
        </div>

        <div>
          <span className="font-semibold text-slate-700">Payment</span>
          <p>₱{u.pay}</p>
        </div>

        <div>
          <span className="font-semibold text-slate-700">Pickup</span>
          <p>{u.pickup}</p>
        </div>

        <div className="col-span-2">
          <span className="font-semibold text-slate-700">Purpose</span>
          <p className="text-slate-600">{u.purpose}</p>
        </div>
      </div>
    </div>

      </div>
    )
  })}
</div>

  )
}
export default Records