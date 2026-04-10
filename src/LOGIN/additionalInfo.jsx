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
    employer: "",
  });

  const isControlled = parentOpen !== undefined && parentClose !== undefined;
  const modalOpen = isControlled ? parentOpen : open;

  const closeModal = () => {
    if (isControlled) parentClose();
    else setOpen(false);
  };

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          title="Additional Info"
        >
          <BookPlus size={22} />
        </button>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold">Additional Info</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            >
              {alertMessage && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {alertMessage}
                </p>
              )}

              {/* Barangay ID */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Barangay ID
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="170"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="65"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">TIN (optional)</label>
                    <input
                      type="text"
                      name="tin"
                      value={form.tin}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="XXX-XXX-XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Barangay Clearance */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Barangay Clearance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your job title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Employer</label>
                    <input
                      type="text"
                      name="employer"
                      value={form.employer}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
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
                  onClick={closeModal}
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
