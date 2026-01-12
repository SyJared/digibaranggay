import { useState } from "react";
function Requests(){
  const [transaction, setTransaction] = useState('');
  const [message, setMessage] = useState('ss');
  const [purpose, setPurpose] = useState('')
  const [active, setActive] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClick = async () => {
  if (!transaction) {
    setMessage("Please select a transaction");
    return;
  }

  if (!purpose.trim()) {
    setMessage("Please enter a purpose");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost/digibaranggay/request.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction,
          purpose,
          user
        }),
      }
    );

    const data = await res.json();
    console.log("Response from PHP:", data);

    if (data.success) {
      setMessage("Request submitted successfully");
    } else {
      setMessage(data.message || "Something went wrong");
    }

  } catch (error) {
    console.error(error);
    setMessage(data.message);
  }
};
const cardClick =(card)=>{
  setTransaction(card);
  setActive(card);
}
const cards = ["KKID Card", "Proof of residency","Certificate of indigency", "Sedula", "Brgy. Clearance", "First job seeker"];
  return(
    <div className="request-body">
    <div className="request">
      {cards.map(c =>{
        const isActive = active === c;
        return(
         <button className={`card relative  z-10 ${isActive?'primary-color text-white -translate-y-1.5' :'bg-gray-200 hover:-translate-y-0.5'}`} onClick={()=> cardClick(c)}>{c}</button>
        )
      })}
      
    </div>
    <div className="request-secondbody">
    <div className="request-form">
      <h1>{transaction}</h1>
      <label htmlFor="purpose">purpose of request</label>
      <textarea name="purpose" id="purpose" onChange={(e)=>setPurpose(e.target.value)}></textarea>
      <p>Payment will be determined once the request is approved (if any)</p>
      <button onClick={handleClick}>Request</button>
      {message && <p className="text-xs text-black">{message}</p>}
    </div>
    <div className="request-info">
      <div className="div"><label htmlFor="firstname"  className="userinfo">FIRSTNAME :  </label ><span name='firstname'>{user.firstname}</span></div>
      <div className="div"><label htmlFor="middlename" className="userinfo">MIDDLENAME : </label ><span name='middlename'>{user.middlename}</span></div>
      <div className="div"><label htmlFor="lastname" className="userinfo">LASTNAME : </label ><span name='lastname'>{user.lastname}</span></div>
      <div className="div"><label htmlFor="address" className="userinfo">ADDRESS : </label ><span name='address'>{user.address}</span></div>
      <div className="div"><label htmlFor="birthdate" className="userinfo">BIRTHDATE : </label ><span name='birthdate'>{user.birthdate}</span></div>
      
    </div>
    </div>
    </div>
  )
}
export default Requests;