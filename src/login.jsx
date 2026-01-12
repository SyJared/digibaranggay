import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateToRegister = () => navigate('/REGISTER/register');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form object:", form);
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost/digibaranggay/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(data.user.role === "admin" ? "/ADMINUI/adhome" : "/USERUI/user");
      } else {
        setMessage(data.user.message);
      }
    } catch (err) {
      
      setMessage('fetch error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
     <span className="title ">DigiBaranggay</span>
      <span className="info">A web-based management information system for community records and document request</span>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {message && <p className="text-md font-medium text-black text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{message}</p>}
          <button className="loginb" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <hr />
        <span className="text-gray-700 ">If you don't have an account register now</span>
        <button className="registerb" onClick={navigateToRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
