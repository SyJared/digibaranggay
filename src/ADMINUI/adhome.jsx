import "./adhome.css";
import { act, useState } from "react";
import Manageusers from "./manageusers";
import Requestees from "./requestees";
import Records from "./records";
import Announcement from "./announcement";
import requestIcon from '../assets/application.png'
import megaphone from '../assets/megaphone.png'
import management from '../assets/management.png';
import records from '../assets/edit.png';

function Adhome() {
  const [active, setActive] = useState(""); // currently active main or dropdown item
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle clicking a main button
  const handleMainClick = (item) => {
    if (item === "Documents") {
      setIsDropdownOpen(!isDropdownOpen); // toggle dropdown
    } else {
      setActive(item);
      setIsDropdownOpen(false); // close dropdown if any other item clicked
    }
  };

  // Handle clicking a dropdown item
  const handleDropdownClick = (item) => {
    setActive(item);
    setIsDropdownOpen(false);
  };

  return (
    <div className="">
      <div className="navs">
        <span>to be coded</span>
      </div>

      <div className="bubbles">
        
        
        <button
          onClick={() => handleMainClick("Requests")}
          className={active === "Requests" ? "primary-color text-white" : ""}
        >
          <img src={requestIcon} alt="" className="icon-size" />Requests
        </button>
        <button
          onClick={() => handleMainClick("Make announcement")}
          className={active === "Make announcement" ? "primary-color text-white" : ""}
        >
          <img src={megaphone} alt="" className="icon-size" />Make announcement
        </button>
        <button
          onClick={() => handleMainClick("Manage Users")}
          className={active === "Manage Users" ? "primary-color text-white" : ""}
        >
          <img src={management} alt="" className="icon-size" />Manage Users
        </button>
        <button
          onClick={() => handleMainClick("Records")}
          className={active === "Records" ? "primary-color text-white" : ""}
        >
          <img src={records} alt="" className="icon-size" />Records
        </button>
        
      </div>

      <div className="manageuser">
       {active === "Manage Users" && <Manageusers />}
       {active === "Requests" && <Requestees />}
       {active ==="Records" && <Records />}
       {active === "Make announcement" && <Announcement />}
       </div>
    </div>
  );
}

export default Adhome;
