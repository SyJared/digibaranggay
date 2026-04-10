import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Emergency() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    emergency_name: "",
    emergency_contact: "",
    emergency_relationship: "",
    emergency_address: "",
  });

  useEffect(() => {
    async function fetchEmergency() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency.php`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.emergency) {
          setForm({
            emergency_name: data.emergency.emergency_name || "",
            emergency_contact: data.emergency.emergency_contact || "",
            emergency_relationship: data.emergency.emergency_relation || "",
            emergency_address: data.emergency.emergency_address || "",
          });
        }
      } catch (err) {
        console.error("Error fetching emergency info:", err);
      }
    }
    if (open) fetchEmergency();
  }, [open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
          emergency_relation: form.emergency_relationship,
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold">
                Emergency Contact
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="emergency_name"
                    value={form.emergency_name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contact Number</label>
                  <input
                    type="text"
                    name="emergency_contact"
                    value={form.emergency_contact}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="09XXXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Relationship</label>
                  <input
                    type="text"
                    name="emergency_relationship"
                    value={form.emergency_relationship}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Mother"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    type="text"
                    name="emergency_address"
                    value={form.emergency_address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Street, Barangay, City"
                    required
                  />
                </div>
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
