import { useContext, useEffect, useState } from "react"
import  {AnnouncementContext}  from "./announcementList";
function Announcement(){
  const {announcement, message, setMessage} =useContext(AnnouncementContext);
  const [secondMessage, setSecondMessage] = useState('');
  const [active, setActive] = useState(null);
  const [createAnnouncement, setCreateAnnouncement] = useState({title : "", body : ""});
  const [editAnnouncement, setEditAnnouncement] = useState({id: "", title : "", body: ""})
  const [editMessage, setEditMessage] = useState('')

  
 
  const handleClick =async ()=>{
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("title", createAnnouncement.title);
    formData.append("body", createAnnouncement.body);

    const res =await fetch("http://localhost/digibaranggay/announcement.php",{
      method : "POST",
      body: formData
    })
    const data = await res.json();
    setSecondMessage(data.secondmessage)
  }

  const toggleActive = (id)=> setActive(active===id ?null :id );
  const selectedUser = announcement.find(a=> a.id === active);
   useEffect(()=>{
    selectedUser && setEditAnnouncement({
      id: selectedUser.id,
      title: selectedUser.title,
      body: selectedUser.body
    })
  },[selectedUser])

  const handleEditClick = async()=>{
    const formData = new FormData();
    formData.append('action', 'edit')
    formData.append('id', editAnnouncement.id);
    formData.append('title', editAnnouncement.title);
    formData.append('body', editAnnouncement.body);

    const res = await fetch("http://localhost/digibaranggay/announcement.php",{
    method : "POST",
    body : formData
    })
    const data = await res.json();
    setEditMessage(data.editmessage)
  }
  

  return (
  <div className="announcement-div">
    <div className="existing-announcement no-scrollbar">
      {message && (
        <p className="text-sm text-emerald-700 mb-2">{message}</p>
      )}

      {announcement.map(a => {
        const isActive = active === a.id;

        return (
          <div key={a.id} className={`ann-title-date`}>
            <div
              className="ann cursor-pointer" onClick={() => toggleActive(a.id)}>
              <div>
                <h3 className="text-lg font-semibold text-green-900">
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

    {selectedUser 
    ? <div className="make-announcement space-y-8 text-gray-700">
      <div><h2 className="text-emerald-900  font-semibold text-3xl">Edit {selectedUser.title}</h2></div>
      <div className="flex flex-col">
        <label className="text-emerald-800  font-semibold">Title</label>
        <input type="text" className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2
         focus:outline-none focus:ring-2 focus:ring-teal-600" value={editAnnouncement.title} 
         onChange={(e)=>setEditAnnouncement({...editAnnouncement, title: e.target.value})}/>
      </div>
      <div className="flex flex-col">
        <label className="text-emerald-800  font-semibold">Body</label>
        <textarea value={editAnnouncement.body} onChange={(e)=>setEditAnnouncement({...editAnnouncement, body: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg p-3 h-40 resize-none
           focus:outline-none focus:ring-2 focus:ring-teal-600" />
      </div>
      <div className="space-x-5">
        <button
        className="bg-emerald-700 text-white px-8 py-2 rounded-lg hover:bg-emerald-800 transition-all duration-200
         active:scale-95" onClick={()=>handleEditClick()}> Edit Announcement
      </button>
      <button className="bg-rose-600 text-white px-8 py-2 rounded-lg hover:bg-rose-700 transition-all duration-200
      active:scale-95">
        Remove this announcement
      </button>
      {editMessage && <p className="primary-color-text font-semibold">{editMessage}</p>}
      </div>
     </div> 
      
      : <div className="make-announcement max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-emerald-900 mb-6">
      Create Announcement
      </h2>

      <div className="space-y-5 text-gray-700">
    
        <div className="flex flex-col gap-2">
        <label className="font-semibold text-emerald-800">
        Announcement Title
        </label>
        <input type="text" placeholder="Enter title..." name="title" value={createAnnouncement.title}
        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2
         focus:outline-none focus:ring-2 focus:ring-teal-600"
         onChange={(e)=>setCreateAnnouncement({...createAnnouncement, [e.target.name]:e.target.value})}/>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-emerald-800"> Announcement Body</label>

        <textarea name="body" id="body" placeholder="Write your announcement here..." value={createAnnouncement.body}
          className="bg-gray-50 border border-gray-300 rounded-lg p-3 h-40 resize-none
           focus:outline-none focus:ring-2 focus:ring-teal-600" 
           onChange={(e)=>setCreateAnnouncement({...createAnnouncement, [e.target.name]:e.target.value})} />
      </div>

    <div className="flex items-center gap-4 pt-4">
      <button
        className="bg-emerald-700 text-white px-8 py-2 rounded-lg hover:bg-emerald-800 transition-all duration-200
         active:scale-95" onClick={()=>handleClick()}> Post Announcement
      </button>

      <p className="primary-color-text">{secondMessage ?secondMessage : ''}</p>

    </div>
  </div>
</div>}

  </div>
);

}
export default Announcement