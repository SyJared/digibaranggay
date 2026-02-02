import { User, X } from "lucide-react";
import { useContext, useState } from "react";
import { RoleContext } from "../rolecontext";
import { RequestContext } from "../requestList";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);

  const{user} = useContext(RoleContext);
  const{users} = useContext(RequestContext)
  // Get user's requests
  const userRequests = users.filter(req => String(req.id) === String( user.id)) || [];
  const statusBorder = {
    Approved : 'border-emerald-600',
    Pending : 'border-orange-400',
    Rejected : 'border-rose-600',
    Expired: 'border-gray-500',
  };
  const statusText = {
    Approved : 'text-emerald-700 bg-emerald-100',
    Pending : 'text-orange-700 bg-orange-100',
    Rejected : 'text-rose-700 bg-rose-100',
    Expired: 'text-gray-700 bg-gray-200',
  }
  return (
    <>
      <button
        className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition font-medium"
        onClick={() => setIsOpen(true)}
      >
        <User className="w-5 h-5" />
        Profile
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed  inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 ">
          {/* Modal Card */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header with Close Button */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-br from-emerald-600 to-teal-600 ">
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="p-6">
              {/* Profile Header with Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {user.firstname} {user.lastname}
                </h3>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Contact Number</p>
                  <p className="text-gray-800">{user.contactnumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                  <p className="text-gray-800">{user.birthdate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Gender</p>
                  <p className="text-gray-800">{user.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Civil Status</p>
                  <p className="text-gray-800">{user.civilstatus || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Address</p>
                  <p className="text-gray-800">{user.address || "N/A"}</p>
                </div>
              </div>

              {/* Requests Section */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Your Requests ({userRequests.length})
                </h4>
                {userRequests.length > 0 ? (
                  <div className="space-y-3">
                    {userRequests.map((request) => (
                      <div
                        key={request.transaction}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {request.purpose}
                            </p>
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
                          <span>Date {request.status === 'Pending' ? '': request.status}: {request.status=== 'Pending' ? 'waiting for admin' : request.dateupdated} </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No requests found
                  </p>
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