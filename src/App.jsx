import {Routes, Route, Navigate} from "react-router-dom";
import Header from './LOGIN/header';
import Login from './LOGIN/login';
import Register from "./REGISTER/register";
import Adhome from "./ADMINUI/adhome";
import User from "./USERUI/user"; 
import { AnnouncementList }  from "./announcementList";
import { RoleProvider } from "./rolecontext";
import { RequestProvider } from "./requestList";
import { RegisteredProvider } from "./registeredContext";



function App() {
  return (
    <div>
      <RegisteredProvider>
      <RoleProvider>
      <RequestProvider><Header /> </RequestProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/LOGIN/login" replace />} />
        <Route path="/LOGIN/login" element={<Login />} />
        <Route path="/REGISTER/register" element={<Register />} />
          <Route path="/ADMINUI/adhome" element={<RequestProvider><AnnouncementList><Adhome /></AnnouncementList></RequestProvider>}></Route>
        <Route path="/USERUI/user" element={<RequestProvider><AnnouncementList><User /></AnnouncementList></RequestProvider>}></Route>
      </Routes>
      </RoleProvider>
      </RegisteredProvider>
    </div>
  );
}

export default App;
