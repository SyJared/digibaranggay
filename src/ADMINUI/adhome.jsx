import "./adhome.css";
import down from "../assets/down.png";
import { act, useState } from "react";
import Manageusers from "./manageusers";
import Requestees from "./requestees";

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
    <>
      <div className="navs">
        <span>to be coded</span>
      </div>

      <div className="bubbles">
        
        
        <button
          onClick={() => handleMainClick("Requests")}
          className={active === "Requests" ? "bg-white" : ""}
        >
          Requests
        </button>
        <button
          onClick={() => handleMainClick("Make announcement")}
          className={active === "Make announcement" ? "bg-white" : ""}
        >
          Make announcement
        </button>
        <button
          onClick={() => handleMainClick("Manage Users")}
          className={active === "Manage Users" ? "bg-white" : ""}
        >
          Manage Users
        </button>
        <button
          onClick={() => handleMainClick("Records")}
          className={active === "Records" ? "bg-white" : ""}
        >
          Records
        </button>
        
      </div>

      <div className="manageuser">
       {active === "Manage Users" && <Manageusers />}
       {active === "Requests" && <Requestees />}
       </div>
    </>
  );
}

export default Adhome;
