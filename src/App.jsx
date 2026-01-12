import {Routes, Route} from "react-router-dom";
import Header from './header';
import Login from './login';
import Register from "./REGISTER/register";
import Adhome from "./ADMINUI/adhome";
import User from "./USERUI/user"; 
import { AnnouncementList }  from "./ADMINUI/announcementList";

function App() {
  return (
    <div>
      <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/REGISTER/register" element={<Register />} />
        
          <Route path="/ADMINUI/adhome" element={<AnnouncementList><Adhome /></AnnouncementList>}></Route>
        <Route path="/USERUI/user" element={<AnnouncementList><User /></AnnouncementList>}></Route>
        
        
      </Routes>
    </div>
  );
}

export default App;
