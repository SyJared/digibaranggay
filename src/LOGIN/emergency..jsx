import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Emergency() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    emergency_name: "",
    emergency_contact: "",
    emergency_relationship: "",
    emergency_address: ""
  });

  // Fetch emergency info on mount
  useEffect(() => {
    async function fetchEmergency() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency.php`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.emergency) {
          // Pre-fill the form inputs
          setForm({
            emergency_name: data.emergency.emergency_name || "",
            emergency_contact: data.emergency.emergency_contact || "",
            emergency_relationship: data.emergency.emergency_relation || "",
            emergency_address: data.emergency.emergency_address || ""
          });
        }
      } catch (err) {
        console.error("Error fetching emergency info:", err);
      }
    }
    fetchEmergency();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          emergency_name: form.emergency_name,
          emergency_address: form.emergency_address,
          emergency_contact: form.emergency_contact,
          emergency_relation: form.emergency_relationship
        }),
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setTimeout(() => {
          setOpen(false);
          setMessage("");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <>
      {/* ICON BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
        title="Emergency Contact"
      >
        <AlertCircle size={22} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6 relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-sm">Full Name</label>
                <input
                  type="text"
                  name="emergency_name"
                  value={form.emergency_name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Contact Number</label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={form.emergency_contact}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Relationship</label>
                <input
                  type="text"
                  name="emergency_relationship"
                  value={form.emergency_relationship}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="e.g. Mother, Friend"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Address</label>
                <input
                  type="text"
                  name="emergency_address"
                  value={form.emergency_address}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Street, Sitio..."
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-3 primary-color text-white py-2 rounded hover:opacity-90"
              >
                Save
              </button>

              {message && (
                <p className={`text-sm mt-2 ${
                  message.includes("successfully") ? "text-green-600" : "text-red-600"
                }`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}