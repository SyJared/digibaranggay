import { useContext, useState } from "react";
import { AnnouncementContext } from "../ADMINUI/announcementList";

function Announcement(){
const {announcement, message, setMessage} = useContext(AnnouncementContext);
const [currentIndex, setCurrentIndex] = useState(2);


const currentAnnouncement = announcement[currentIndex];
  return(
    
    <div className='announcement '>
      {announcement.length === 0 && <p>no announcement</p>}
      {currentAnnouncement && (
        <div className="space-y-2 relative">
          <span className="flex justify-self-center font-semibold text-2xl primary-color-text">{currentAnnouncement.title}</span>
            <p className="text-center">{currentAnnouncement.body}</p>
            <span className="absolute text-sm font-semibold text-gray-400">{currentAnnouncement.date}</span>
        </div>
      )}
    </div>
  )
}
export default Announcement;