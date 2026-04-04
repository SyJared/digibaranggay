import { User, X } from "lucide-react";
import { useContext, useState } from "react";
import { RoleContext } from "../rolecontext";
import { RequestContext } from "../requestList";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useContext(RoleContext);
  const { users } = useContext(RequestContext);

  const [editData, setEditData] = useState({
    firstname: user.firstname,
    middlename: user.middlename || "",
    lastname: user.lastname,
    email: user.email,
    contactnumber: user.contactnumber || "",
    birthdate: user.birthdate || "",
    gender: user.gender || "",
    civilstatus: user.civilstatus || "",
    sitio: user.sitio || "",
    street: user.street || "",
  });

  const userRequests = users.filter(req => String(req.id) === String(user.id)) || [];

  const statusBorder = {
    Approved: "border-emerald-600",
    Pending: "border-orange-400",
    Rejected: "border-rose-600",
    Expired: "border-gray-500",
  };
  const statusText = {
    Approved: "text-emerald-700 bg-emerald-100",
    Pending: "text-orange-700 bg-orange-100",
    Rejected: "text-rose-700 bg-rose-100",
    Expired: "text-gray-700 bg-gray-200",
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost/digibaranggay/update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, ...editData }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, ...editData }));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition font-medium"
        onClick={() => setIsOpen(true)}
      >
        <User className="w-5 h-5" />
        Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-br from-emerald-600 to-teal-600">
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {editData.firstname} {editData.lastname}
                </h3>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-6 rounded-lg">
                {[
                  { label: "First Name", key: "firstname" },
                  { label: "Middle Name", key: "middlename" },
                  { label: "Last Name", key: "lastname" },
                  { label: "Email", key: "email" },
                  { label: "Contact Number", key: "contactnumber" },
                  { label: "Date of Birth", key: "birthdate" },
                  { label: "Gender", key: "gender" },
                  { label: "Civil Status", key: "civilstatus" },
                  { label: "Sitio", key: "sitio" },
                  { label: "Street", key: "street" },
                ].map(field => (
                  <div key={field.key}>
                    <p className="text-sm font-semibold text-gray-600">{field.label}</p>
                    {isEditing ? (
                      <input
                        type={field.key === "birthdate" ? "date" : "text"}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={editData[field.key]}
                        onChange={e => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    ) : (
                      <p className="text-gray-800">{editData[field.key] || "N/A"}</p>
                    )}
                  </div>
                ))}
              </div>

            
              {/* Edit / Save / Cancel Buttons Below Info */}
<div className="flex justify-center gap-4 mb-6">
  {!isEditing && (
    <button
      onClick={() => setIsEditing(true)}
      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
    >
      Edit Info
    </button>
  )}
  {isEditing && (
    <>
      <button
        onClick={handleSave}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
      >
        Save Changes
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setEditData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            contactnumber: user.contactnumber || "",
            birthdate: user.birthdate || "",
            gender: user.gender || "",
            civilstatus: user.civilstatus || "",
            sitio: user.sitio || "",
            street: user.street || "",
            middlename: user.middlename || "",
          });
        }}
        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </>
  )}
</div>

              {/* Requests Section */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Your Requests ({userRequests.length})
                </h4>
                {userRequests.length > 0 ? (
                  <div className="space-y-3">
                    {userRequests.map(request => (
                      <div
                        key={request.transaction}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{request.purpose}</p>
                            <p className="text-sm text-gray-600">
                              Transaction: {request.transaction}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 border-2 rounded-full text-sm font-medium 
                              ${statusBorder[request.status]} ${statusText[request.status]}`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Date: {request.date}</span>
                          <span>
                            {request.status === "Pending"
                              ? "Waiting for admin"
                              : `Updated: ${request.dateupdated}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No requests found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;