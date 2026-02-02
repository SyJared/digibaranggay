import './user.css';
import Announcement from "./announcement";
import Request from "./request";
import { useNavigate } from 'react-router-dom';


function User() {
  const navigate = useNavigate();
  
  return (
    <>
    
      <Announcement />
      <Request />
    </>
  );
}

export default User;
