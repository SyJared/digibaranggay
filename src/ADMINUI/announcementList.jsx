import { createContext, useEffect, useState } from "react";

export const AnnouncementContext = createContext({
  announcement:[],
  message: '',
  setMessage: () => {}
});

export function AnnouncementList({children}){
  const [announcement, setAnnouncement] = useState([]);
  const [message, setMessage] = useState('')

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
      setMessage(err.message || 'fetch error')
    })
  },[]);

  return(
    <AnnouncementContext.Provider value={{announcement, message, setMessage}}>
      {children}
    </AnnouncementContext.Provider>
  )
}