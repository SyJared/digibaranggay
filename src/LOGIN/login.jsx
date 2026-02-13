import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RoleContext } from "../rolecontext";
import { RegisteredContext } from "../registeredContext";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useContext(RoleContext);
  const {registered} = useContext(RegisteredContext)

  const navigateToRegister = () => navigate("/REGISTER/register");

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
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // Check user status
      if (data.user.status !== "Accepted") {
        setMessage("Your account is not approved yet. Please wait for approval.");
        setLoading(false);
        return;
      }

      // If accepted, proceed
      localStorage.setItem("user", JSON.stringify(data.user));
      setRole(data.user.role);
      navigate(
        data.user.role === "admin"
          ? "/ADMINUI/adhome"
          : "/USERUI/user"
      );

    } else {
      setMessage(data.message);
    }
  } catch (err) {
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 bg-gray-100">
      
      {/* LEFT — LOGIN (smaller) */}
      <div className="md:col-span-1 flex items-center justify-center p-8 bg-white shadow-xl">
        <div className="w-full max-w-sm space-y-6">
          
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">
              DigiBaranggay
            </h1>
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

          <div className="text-center text-sm text-gray-600">
            No account yet?
          </div>

          <button
            onClick={navigateToRegister}
            className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-lg font-medium transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* RIGHT — INFO PANEL (bigger) */}
      <div className="md:col-span-2 primary-color text-white p-10 flex flex-col justify-center">
        
        <h2 className="text-4xl font-bold mb-4">
          Barangay Dashboard Overview
        </h2>

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
            <p className="text-3xl font-bold">186</p>
          </div>
        </div>

        {/* Available Requests */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Available Requests
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              "KKID Card",
              "Barangay ID",
              "Barangay Clearance",
              "Working Clearance",
              "OSCA",
              "Certificate of Indigency",
              "First Job Seeker",
              "Barangay Inhabitants",
            ].map((item) => (
              <div
                key={item}
                className="bg-white/10 rounded-lg px-4 py-3 hover:bg-white/20 transition"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
