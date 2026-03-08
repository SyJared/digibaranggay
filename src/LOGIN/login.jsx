import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../rolecontext";
import { RegisteredContext } from "../registeredContext";
import { RequestContext } from "../requestList";

function Login() {
  const navigate = useNavigate();
  const { role, setRole, user, setUser } = useContext(RoleContext);
  const { registered } = useContext(RegisteredContext);
  const { users } = useContext(RequestContext)
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost/digibaranggay/checkAuth.php", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
          setRole(data.user.role);
          navigate(data.user.role === "admin" ? "/ADMINUI/adhome" : "/USERUI/user");
        }
      } catch (err) {
        console.log("Not authenticated", err);
      }
    };
    checkAuth();
  }, [navigate, setRole, setUser]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        // Fetch session immediately
        const authRes = await fetch("http://localhost/digibaranggay/checkAuth.php", {
          method: "GET",
          credentials: "include"
        });
        const authData = await authRes.json();
        
        if (authData.authenticated) {
          setUser(authData.user);
          setRole(authData.user.role);
          navigate(authData.user.role === "admin" ? "/ADMINUI/adhome" : "/USERUI/user");
        }
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  const navigateToRegister = () => navigate("/REGISTER/register");

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 bg-gray-100">
      {/* LEFT — LOGIN */}
      <div className="md:col-span-1 flex items-center justify-center p-8 bg-white shadow-xl">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">DigiBaranggay</h1>
            <p className="text-sm text-gray-600 mt-2">
              Community records and document request system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {message && (
              <div className="text-sm text-center text-red-600 bg-red-50 p-2 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">No account yet?</div>
          <button
            onClick={navigateToRegister}
            className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-lg font-medium transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* RIGHT — INFO PANEL */}
      <div className="md:col-span-2 primary-color text-white p-10 flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-4">Barangay Dashboard Overview</h2>
        <p className="opacity-90 mb-10 max-w-xl">
          DigiBaranggay helps manage community records and simplifies
          document requests for residents.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/15 backdrop-blur rounded-xl p-6">
            <p className="text-sm opacity-80">Estimated Population</p>
            <p className="text-3xl font-bold">6000+</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-6">
            <p className="text-sm opacity-80">Registered Residents</p>
            <p className="text-3xl font-bold">
              {registered.filter((u) => u.status === "Accepted").length}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-6">
            <p className="text-sm opacity-80">Successful requests</p>
            <p className="text-3xl font-bold">{users.filter((u)=> u.status === 'Successful').length || '0'}</p>
          </div>
        </div>

        {/* Available Requests */}
        <div>
  <h3 className="text-2xl font-semibold mb-4">Available Requests</h3>

  {/** group successful transactions once */}
  {(() => {
    const transactions = [
      "KKID Card",
      "Barangay ID",
      "Barangay clearance",
      "Working clearance",
      "OSCA",
      "Certificate of indigency",
      "First job seeker",
      "Barangay inhabitants",
    ];

    const successfulByTransaction = users.reduce((acc, u) => {
      if (u.status === "Successful") {
        acc[u.transaction] = (acc[u.transaction] || 0) + 1;
      }
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {transactions.map((item) => (
          <div
            key={item}
            className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-3 hover:bg-white/20 transition"
          >
            <span>{item}</span>

            <span className="text-xs opacity-80">
              {successfulByTransaction[item] || 0} successful
            </span>
          </div>
        ))}
      </div>
    );
  })()}
</div>
      </div>
    </div>
  );
}

export default Login;