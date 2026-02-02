import { useContext, useState } from "react";
import { RequestContext } from "../requestList";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { RoleContext } from "../rolecontext";

function RequestBubble() {
  const { users, listingError } = useContext(RequestContext);
  const [activeStatus, setActiveStatus] = useState(null);
  const{user} = useContext(RoleContext);
 
  const selectedRequests = activeStatus 
    ? users.filter(u => 
        String(u.id) === String(user?.id) && u.status === activeStatus
      ) 
    : [];

  // Count requests
  const pendingCount = users.filter(u => 
    String(u.id) === String(user?.id) && u.status === 'Pending'
  ).length;

  const rejectedCount = users.filter(u => 
    String(u.id) === String(user?.id) && u.status === 'Rejected'
  ).length;

  const approvedCount = users.filter(u => 
    String(u.id) === String(user?.id) && u.status === 'Approved'
  ).length;

  const statusConfig = {
    Pending: {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-900',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    Rejected: {
      bg: 'bg-rose-100',
      border: 'border-rose-300',
      text: 'text-rose-900',
      icon: XCircle,
      color: 'text-rose-600'
    },
    Approved: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-900',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  };

  const StatusButton = ({ status, count }) => {

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <button
        onClick={() => setActiveStatus(isActive ? null : status)}
        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${config.bg} ${config.border} ${config.text} shadow-md`}
      >
        <div className="flex items-center gap-2">
          <Icon size={20} className={config.color } />
          <span className="font-semibold">{status} requests</span>
        </div>
        <span className="font-bold text-lg">{count}</span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-[1000px] h-[500px] mx-auto flex gap-6 mt-10 font-semibold">

      <div className="w-[400px] border-2 border-gray-200 bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">My Requests</h3>
        <div className="space-y-3">
          <StatusButton status="Pending" count={pendingCount} />
          <StatusButton status="Rejected" count={rejectedCount} />
          <StatusButton status="Approved" count={approvedCount} />
        </div>
      </div>

      {/* Request Details */}
      
    </div>
  );
}

export default RequestBubble;