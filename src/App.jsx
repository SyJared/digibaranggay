import {Routes, Route} from "react-router-dom";
import Header from './header';
import Login from './login';
import Register from "./REGISTER/register";
import Adhome from "./ADMINUI/adhome";
import User from "./USERUI/user"; 


function App() {
  return (
    <div>
      <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/REGISTER/register" element={<Register />} />
        <Route path="/ADMINUI/adhome" element={<Adhome />}></Route>
        <Route path="/USERUI/user" element={<User />}></Route>
        
      </Routes>
    </div>
  );
}

export default App;
