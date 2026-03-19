import { useContext, useState } from "react";
import { AnnouncementContext } from "../announcementList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import './user.css';

function Announcement() {
  const { announcement } = useContext(AnnouncementContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAnnouncement = announcement[currentIndex];

  return (
    <div className='announcement'>
      {announcement.length === 0 && <p>No announcements</p>}

      {currentAnnouncement && (
        <div className="space-y-3 relative">
          <div className="relative">
            <h2 className="primary-color-text font-bold text-xl">{currentAnnouncement.title}</h2>
            <span className="absolute right-0 -top-1 whitespace-nowrap px-2 py-1 primary-color rounded-full text-white text-xs font-semibold">
              {currentAnnouncement.date}
            </span>
          </div>

          <div className="border-y-1 border-emerald-400 max-h-[150px] text-center text-gray-900 font-light overflow-hidden overflow-y-scroll no-scrollbar px-1 py-3">
            <p>{currentAnnouncement.body}</p>
          </div>

          {/* Dots */}
          {announcement.length > 1 && (
            <div className="flex justify-center space-x-2 mt-3">
              {announcement.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-emerald-700 w-10' : 'bg-gray-300'}`}
                  onClick={() => setCurrentIndex(index)}
                ></button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-2">
            <button 
              onClick={() => setCurrentIndex(c => (c - 1 + announcement.length) % announcement.length )}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => setCurrentIndex(c => (c + 1) % announcement.length )}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcement;