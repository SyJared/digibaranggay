import './user.css';
import Announcement from "./announcement";
import Request from "./request";
import profile from '../assets/user.png';

function User(){
  return(<>
    <div className="nav">
      <span><img src={profile} alt="" className='w-9 h-9 flex self-center rounded-3xl bg-transparent'  />profile</span>
      <span>Logout</span>
    </div>
    <Announcement />
    <Request />
    </>
  )
}
export default User;