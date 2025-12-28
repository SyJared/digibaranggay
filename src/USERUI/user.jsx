import './user.css';
import Announcement from "./announcement";
import Request from "./request";
import profile from '../assets/user.png';
import { useNavigate } from 'react-router-dom'; // ✅ corrected

import { useEffect } from 'react';

function User() {
  const navigate = useNavigate();

  // Protect page: redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/'); // redirect to login
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/'); // redirect to login
  };

  return (
    <>
      <div className="nav">
        <span>
          <img src={profile} alt="" className='w-9 h-9 flex self-center rounded-3xl bg-transparent' />profile
        </span>
        <span className='cursor-pointer' onClick={handleLogout}>Logout</span>
      </div>
      <Announcement />
      <Request />
    </>
  );
}

export default User;
