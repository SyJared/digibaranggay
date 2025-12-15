import "./adhome.css";
import down from "../assets/down.png";
import { useState } from "react";
import Approval from "./approval";
function Adhome(){
  
  
  const [active, setActive] = useState('');

    return(
    <>
    <div className="navs">
      <span>to be coded</span>
    </div>

    
    <div className="bubbles">
   
      <button onClick={()=>{setActive('KKID Card')}} className={active === 'KKID Card' ? 'bg-white':''}>KKID Card</button>
      <button onClick={()=>setActive('Proof of residency')} className={active ==='Proof of residency' ? 'bg-white':''}>Proof of residency</button>
      <button >Requests</button>
      <button >Make announcement</button>
      <button >Manage Users</button>
      <button >Records</button>
      <button onClick={
        ()=>{setActive('Documents');}} 
        className={active === 'Documents' ? 'bg-white':''}>Documents 
        <img src={down} alt="" className="w-5 ml-1 mt-1"/></button>
    </div>
    

    {active ==='Documents' && <div className="dropdown">
      <ul>
      <li onClick={()=> setActive('Certificate of indigency')}>Certificate of indigency</li>
      <li onClick={()=> setActive('Sedula')}>Sedula</li>
      <li onClick={()=> setActive('Baranggay Clearance')}>Baranggay Clearance</li>
      <li onClick={()=> setActive('Baranggay ID')}>Baranggay ID</li>
      <li onClick={()=> setActive('First time job seeker')}>First time job seeker</li>
      <li onClick={()=> setActive('Proof of indigency')}>Proof of indigency</li>
      </ul>
    </div>}
    <Approval/>
    </>
    )
}
export default Adhome;