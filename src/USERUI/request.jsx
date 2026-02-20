import { useContext, useState } from "react";
import {
  CreditCard,
  Home,
  Shield,
  FileText,
  UserRoundCheck,
  Briefcase,
  Check,
  X,
  SquareArrowRight,
  IdCard,
  FileCheck
} from "lucide-react";
import RequestBubble from "./requestbubble";
import PersonalInfoModal from "./personalInfoModal";
import { RequestContext } from "../requestList";
import Verify from "./verify"; // PIN modal

function Requests() {
  const { users } = useContext(RequestContext);
  const [transaction, setTransaction] = useState("KKID Card");
  const [purpose, setPurpose] = useState("");
  const [active, setActive] = useState("KKID Card");
  const [isVerified, setIsVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showVerify, setShowVerify] = useState(false); // PIN modal
  const [pendingRequest, setPendingRequest] = useState(null); // store transaction & purpose before submitting

  // Only one message now for request/PIN
  const [requestMessage, setRequestMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const payment = {
    "KKID Card": 0.0,
    "Brgy. clearance": 50.0,
    "Certificate of indigency": 0.0,
    "Barangay ID": 50.0,
    "Working clearance": 50.0,
    OSCA: 0.0,
    "First job seeker": 0.0,
    "Barangay inhabitants": 0.0
  };

  const color = {
    Pending: "text-orange-600",
    Approved: "text-green-600",
    Rejected: "text-rose-600"
  };

  const iconMap = {
    "KKID Card": CreditCard,
    "Brgy. clearance": UserRoundCheck,
    "Certificate of indigency": Shield,
    OSCA: FileText,
    "Barangay inhabitants": Home,
    "First job seeker": Briefcase,
    "Barangay ID": IdCard,
    "Working clearance": FileCheck
  };

  const cards = [
    { card: "KKID Card" },
    { card: "Brgy. clearance" },
    { card: "Certificate of indigency" },
    { card: "Working clearance" },
    { card: "OSCA" },
    { card: "First job seeker" },
    { card: "Barangay inhabitants" },
    { card: "Barangay ID" }
  ];

  const existingRequest = users?.find(
    (req) => String(req.id) === String(user.id) && req.transaction === transaction
  );

  const cardClick = (card) => {
    setTransaction(card);
    setActive(card);
    setRequestMessage("");
  };

  const handleClick = () => {
    if (!transaction) {
      setRequestMessage("Please select a transaction");
      return;
    }

    if (!purpose.trim()) {
      setRequestMessage("Please enter a purpose");
      return;
    }

    // Open PIN modal
    setPendingRequest({ transaction, purpose });
    setShowVerify(true);
  };

  const handlePinSubmit = async (pin) => {
  try {
    const res = await fetch("http://localhost/digibaranggay/request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction: pendingRequest.transaction,
        purpose: pendingRequest.purpose,
        user,
        pin,
        payment: payment[pendingRequest.transaction]
      })
    });

    const data = await res.json();

    if (data.success) {
      setRequestMessage(data.message);
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};

  const handleVerify = () => {
    if (isChecked) {
      setIsVerified(true);
    }
  };

  return (
    <>
      {/* Transaction cards */}
      <div className="grid grid-cols-4 gap-4 mt-7 mb-5 max-w-[1150px] mx-auto">
        {cards.map((c) => {
          const isActive = active === c.card;
          const Icon = iconMap[c.card];
          return (
            <button
              key={c.card}
              onClick={() => cardClick(c.card)}
              className={`py-10 flex flex-col items-center justify-center gap-2 rounded-lg transition-transform duration-300 ${
                isActive
                  ? "primary-color text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-teal-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {Icon && <Icon size={28} />}
              <span className="text-sm font-semibold text-center">{c.card}</span>
            </button>
          );
        })}
      </div>

      {/* Request form & user info */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1300px] mx-auto mt-6">
        {/* Left: Request form */}
        <div className="relative flex-1 bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-4 max-h-[420px]">
          <h1 className="text-2xl font-bold text-gray-900">{transaction}</h1>

          {existingRequest && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm bg-white/50">
              <div className="bg-white px-6 py-4 rounded-lg shadow-xl text-center max-w-sm">
                <p className="text-lg font-bold text-gray-800 whitespace-nowrap">
                  Your request for {transaction} is
                </p>
                <p className={`text-xl font-extrabold ${color[existingRequest.status]} mt-1`}>
                  {existingRequest.status}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-6 gap-2">
            <label htmlFor="purpose" className="font-semibold text-gray-700">
              Purpose of Request
            </label>
            <textarea
              id="purpose"
              name="purpose"
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
            />
            <p className="text-sm text-gray-500">
              Payment: {payment[transaction] === 0 ? "FREE" : `₱${payment[transaction]}`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              disabled={!isVerified && !isChecked}
              onClick={handleClick}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isVerified
                  ? "primary-color text-white hover:opacity-95 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Request
            </button>
            {requestMessage && (
              <p className="text-green-600 font-semibold">{requestMessage}</p>
            )}
          </div>
        </div>

        {/* Right: User info & verify */}
        <div className="flex-1 flex flex-col gap-4">
          {/* User info card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-4">
            <div className="flex items-center gap-4 bg-slate-100 p-3 rounded-t-xl">
              <span className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                {user.firstname.charAt(0)}
                {user.lastname.charAt(0)}
              </span>
              <div>
                <p className="font-bold text-gray-900">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-600">Account Information</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Address</p>
                <span className="text-gray-800">{user.address}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Birthdate</p>
                <span className="text-gray-800">{user.birthdate}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Contact</p>
                <span className="text-gray-800">{user.contact}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Civil Status</p>
                <span className="text-gray-800">{user.civilstatus}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Gender</p>
                <span className="text-gray-800">{user.gender}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Household no.</p>
                <span className="text-gray-800">{user.housenumber}</span>
              </div>
            </div>
          </div>

          {/* Verify info card */}
          <div
            className={`rounded-xl shadow-lg p-6 transition-all duration-500 ${
              isVerified ? "bg-green-50 border border-green-300" : "bg-white border border-gray-200"
            }`}
          >
            {!isVerified && (
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-emerald-600"
                />
                <label htmlFor="confirm" className="text-gray-700 text-sm font-medium cursor-pointer">
                  I confirm that the information above is correct
                </label>
                <PersonalInfoModal />
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!isChecked && !isVerified}
              className={`w-full py-3 font-semibold rounded-lg transition-all ${
                isVerified
                  ? "bg-green-500 text-white cursor-default"
                  : isChecked
                  ? "bg-teal-800 text-white hover:bg-teal-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isVerified ? "✓ Verified" : "Verify"}
            </button>
          </div>
        </div>
      </div>

      <RequestBubble />

      {/* PIN modal */}
      <Verify
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        onSubmit={handlePinSubmit}
      />
    </>
  );
}

export default Requests;
