import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login(){
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const navigateToRegister = () => {
    navigate('/REGISTER/register');
  };
  const navigateToAdhome = ()=>{
    navigate('/ADMINUI/adhome');
  }
  const handleChange = (e) => setForm({ ...form, [e.target.name] : e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if(form.username.trim() === "" || form.password === ""){
      alert("Please fill in all required fields.");
      return;
    }  console.log("Login Data:", form)
    navigateToAdhome();
  };
  return(
    <div className="back">
      <span className="title">DigiBaranggay</span>
      <span className="info">A web-based management information system for community records and document request system</span>
      <div className="login">
    <form  onSubmit={handleSubmit}>

      <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange}/>

      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}/>

      <button className="loginb" type="submit">Login</button>
    </form>
      <hr></hr>
      <span>if you dont have an account register now</span>
      <button className="registerb" onClick={() => navigateToRegister()}>Register</button>
    
    </div>
  </div>
  )
}
export default Login