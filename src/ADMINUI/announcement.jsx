import { useEffect, useState } from "react"

function Announcement(){
  const [announcement, setAnnouncement] = useState([]);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(null);

  useEffect(()=>{
    fetch("http://localhost/digibaranggay/announcement.php").then(res => res.json())
    .then(result => {
      if(result.success === true){
        setAnnouncement(result.data)
      }else{
        setMessage(result.message)
      }
    })
    .catch(err =>{
      setMessage(err)
    })
  },[]);

  const toggleActive = (id)=> setActive(active===id ?null :id )
  return (
  <div className="announcement-div">
    {/* LEFT: Existing announcements */}
    <div className="existing-announcement">
      {message && (
        <p className="text-sm text-emerald-700 mb-2">{message}</p>
      )}

      {announcement.map(a => {
        const isActive = active === a.id;

        return (
          <div key={a.id} className="ann-title-date">
            <div
              className="ann cursor-pointer" onClick={() => toggleActive(a.id)}>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">
                  {a.title}
                </h3>
                <p className="text-xs text-emerald-700">
                  {a.date}
                </p>
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${
                isActive ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
              <p className="text-base leading-relaxed text-gray-800">
                {a.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    <div className="make-announcement">
      <h2 className="text-xl font-semibold text-emerald-900">
        Create Announcement
      </h2>
      <p className="text-sm text-gray-600">
        Select an announcement to view or create a new one.
      </p>
    </div>
  </div>
);

}
export default Announcement