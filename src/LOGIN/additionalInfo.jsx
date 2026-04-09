import { useState, useEffect } from "react";
import { BookPlus } from "lucide-react";

export default function AdditionalInfo({ isOpen: parentOpen, onClose: parentClose, alertMessage }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    height: "",
    weight: "",
    tin: "",
    position: "",
    employer: ""
  });

  // Controlled vs internal
  const isControlled = parentOpen !== undefined && parentClose !== undefined;
  const modalOpen = isControlled ? parentOpen : open;

  const closeModal = () => {
    if (isControlled) parentClose();
    else setOpen(false);
  };

  // Fetch existing data
  useEffect(() => {
    if (!modalOpen) return;

    async function fetchData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/additionalInfo.php`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.additional_info) {
          setForm({
            height: data.additional_info.height ?? "",
            weight: data.additional_info.weight ?? "",
            tin: data.additional_info.tin ?? "",
            position: data.additional_info.position ?? "",
            employer: data.additional_info.employer ?? "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [modalOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/additionalInfo.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setTimeout(() => {
          setMessage("");
          closeModal();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <>
      {/* Open Button */}
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          title="Additional Info"
        >
          <BookPlus size={22} />
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Additional Info</h2>

            {alertMessage && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
                {alertMessage}
              </p>
            )}

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">

              {/* ===== Barangay ID Section ===== */}
              <div>
                <h3 className="text-md font-semibold mb-2">For Barangay ID</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Enter height in cm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Enter weight in kg"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm">TIN (optional)</label>
                    <input
                      type="text"
                      name="tin"
                      value={form.tin}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Enter TIN"
                    />
                  </div>
                </div>
              </div>

              {/* ===== Barangay Clearance Section ===== */}
              <div className="border-t pt-3">
                <h3 className="text-md font-semibold mb-2">For Barangay Clearance</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Enter your position"
                    />
                  </div>

                  <div>
                    <label className="text-sm">Employer</label>
                    <input
                      type="text"
                      name="employer"
                      value={form.employer}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Enter employer/company"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-3 primary-color text-white py-2 rounded hover:opacity-90"
              >
                Save
              </button>

              {/* Message */}
              {message && (
                <p className={`text-sm mt-2 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
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