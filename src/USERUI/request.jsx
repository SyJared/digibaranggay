import { useContext, useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Home,
  Shield,
  FileText,
  UserRoundCheck,
  Briefcase,
  IdCard,
  FileCheck
} from "lucide-react";

import Verify from "./verify"; // PIN modal
import { RequestContext } from "../requestList";
import { RoleContext } from "../rolecontext";
import AdditionalInfo from "../LOGIN/additionalInfo";

function Requests() {
  const { users } = useContext(RequestContext);
  const { user } = useContext(RoleContext);

  // ===== States =====
  const [transaction, setTransaction] = useState("KKID Card");
  const [purpose, setPurpose] = useState("");
  const [active, setActive] = useState("KKID Card");
  const [isVerified, setIsVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [guardianChecked, setGuardianChecked] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");

  const transactionsWithAdditionalInfo = ["Barangay ID", "KKID Card", 'Working clearance']; 
  const [showAdditional, setShowAdditional] = useState(false);
  // ===== Payment & Icons =====
  const payment = {
    "KKID Card": 0,
    "Brgy. clearance": 50,
    "Certificate of indigency": 0,
    "Barangay ID": 50,
    "Working clearance": 50,
    OSCA: 0,
    "First job seeker": 0,
    "Barangay inhabitants": 0
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

  const cards = Object.keys(iconMap).map((c) => ({ card: c }));

  // ===== Derived =====
  const existingRequest = useMemo(() => {
    return users
      ?.filter(req => String(req.id) === String(user?.id) && req.transaction === transaction)
      ?.sort((a, b) => new Date(b.dateupdated || b.date) - new Date(a.dateupdated || a.date))[0];
  }, [users, user, transaction]);

  // ✅ Use == (not ===) so both number 1 and string "1" pass
  const canRequestAgain = !existingRequest || existingRequest.request_again == 1;

  const isMinor = useMemo(() => {
    if (!user?.birthdate) return false;
    const today = new Date();
    const birth = new Date(user.birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age < 18;
  }, [user]);

  // ✅ Plain booleans, no useMemo
  const canVerify = isMinor ? (isChecked && guardianChecked) : isChecked;
  const canSubmit = isVerified && canRequestAgain;

  // ===== Effects =====
  useEffect(() => {
    setRequestMessage("");
    setNotifyMessage("");
    setPurpose("");
    setIsVerified(false);
    setIsChecked(false);
    setGuardianChecked(false);
  }, [transaction]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          const res = await fetch("http://localhost/digibaranggay/checkAuth.php", {
            method: "GET",
            credentials: "include"
          });
          const data = await res.json();
          if (!data.authenticated) window.location.href = "/login";
        } catch (err) {
          console.error("Failed to check session:", err);
          window.location.href = "/login";
        }
      }
    };
    checkAuth();
  }, [user]);

  // ===== Handlers =====
  const cardClick = (card) => {
    setTransaction(card);
    setActive(card);
    setRequestMessage("");
  };

  const handleVerify = () => {
   
    setIsVerified(true);
  };

  const handleClick = async () => {
  if (!transaction) return setRequestMessage("Please select a transaction");
  if (!purpose.trim()) return setRequestMessage("Please enter a purpose");

  if (transactionsWithAdditionalInfo.includes(transaction)) {
    try {
      const res = await fetch("http://localhost/digibaranggay/additionalInfo.php", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Additional Info response:", data);

      if (!data.success || !data.additional_info) {
        return setShowAdditional(true);
      }

      const info = data.additional_info;

      let missing = false;

      // ✅ Barangay ID requirement
      if (transaction === "Barangay ID") {
        missing = !info.height || !info.weight;
      }

      // ✅ Working Clearance requirement
      if (transaction === "Working clearance") {
        missing = !info.position || !info.employer;
      }

      // ✅ KKID (if you want same as ID)
      if (transaction === "KKID Card") {
        missing = !info.height || !info.weight;
      }

      if (missing) {
        console.log("❌ Missing required fields");
        return setShowAdditional(true);
      }

    } catch (err) {
      console.error(err);
    }
  }

  // Continue to PIN
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
          pin: String(pin).padStart(4, "0"),
          payment: payment[pendingRequest.transaction]
        })
      });
      const data = await res.json();
      if (data.success) setRequestMessage(data.message);
      return { success: data.success };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  const handleNotifyAdmin = async () => {
    if (!existingRequest) return;
    try {
      const res = await fetch("http://localhost/digibaranggay/notify_request_again.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ transaction: existingRequest.transaction })
      });
      const data = await res.json();
      setNotifyMessage(data.message);
    } catch {
      setNotifyMessage("Failed to notify admin");
    }
  };

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  // ===== Render =====
  return (
    <>
      {/* Transaction Cards */}
      <div className="grid grid-cols-4 gap-4 mt-7 mb-5 max-w-[1150px] mx-auto">
        {cards.map(c => {
          const Icon = iconMap[c.card];
          return (
            <button
              key={c.card}
              onClick={() => cardClick(c.card)}
              className={`py-10 flex flex-col items-center justify-center gap-2 rounded-lg transition-transform duration-300 ${
                active === c.card
                  ? "primary-color text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-teal-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <Icon size={28} />
              <span className="text-sm font-semibold text-center">{c.card}</span>
            </button>
          );
        })}
      </div>

      {/* Form & User Info */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1300px] mx-auto mt-6">
        {/* Left: Request Form */}
        <div className="relative flex-1 bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-4 max-h-[420px]">
          <h1 className="text-2xl font-bold text-gray-900">{transaction}</h1>

          {existingRequest?.request_again == 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm bg-white/50 gap-4">
              <div className="bg-white px-6 py-4 rounded-lg shadow-xl text-center max-w-sm space-y-3">
                <p className="text-lg font-bold text-gray-800">
                  Your request for {transaction} is
                </p>
                <p className={`text-xl font-extrabold ${color[existingRequest.status]}`}>
                  {existingRequest.status}
                </p>
              </div>

              {["Successful", "Rejected", "Expired"].includes(existingRequest.status) &&
                existingRequest.request_again == 0 && (
                  <button
                    onClick={handleNotifyAdmin}
                    className="bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow transition"
                  >
                    Notify Admin to Allow Request Again
                  </button>
                )}
              {notifyMessage && <p className="text-sm text-green-700 font-medium">{notifyMessage}</p>}
            </div>
          )}

          <div className="flex flex-col space-y-6 gap-2">
            <label htmlFor="purpose" className="font-semibold text-gray-700">Purpose of Request</label>
            <textarea
              id="purpose"
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
            />
            <p className="text-sm text-gray-500">
              Payment: {payment[transaction] === 0 ? "FREE" : `₱${payment[transaction]}`}
            </p>
          </div>

          <button
            disabled={!canSubmit}
            onClick={handleClick}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${
              canSubmit ? "primary-color text-white hover:opacity-95 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Request
          </button>
          {requestMessage && <p className="text-green-600 font-semibold">{requestMessage}</p>}
        </div>

        {/* Right: User Info & Verify */}
        <div className="flex-1 flex flex-col gap-4">
          {/* User Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-4">
            <div className="flex items-center gap-4 bg-slate-100 p-3 rounded-t-xl">
              <span className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                {user.firstname.charAt(0)}
                {user.lastname.charAt(0)}
              </span>
              <div>
                <p className="font-bold text-gray-900">{user.firstname} {user.lastname}</p>
                <p className="text-sm text-gray-600">Account Information</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="font-semibold text-gray-700">Street & Sitio</p><span className="text-gray-800">{user.sitio}, {user.street}</span></div>
              <div><p className="font-semibold text-gray-700">Birthdate</p><span className="text-gray-800">{user.birthdate}</span></div>
              <div><p className="font-semibold text-gray-700">Contact</p><span className="text-gray-800">{user.contactnumber}</span></div>
              <div><p className="font-semibold text-gray-700">Civil Status</p><span className="text-gray-800">{user.civilstatus}</span></div>
              <div><p className="font-semibold text-gray-700">Gender</p><span className="text-gray-800">{user.gender}</span></div>
              <div><p className="font-semibold text-gray-700">Household no.</p><span className="text-gray-800">{user.household}</span></div>
            </div>
          </div>

          {/* Verify Card */}
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-500 ${isVerified ? "bg-green-50 border border-green-300" : "bg-white border border-gray-200"}`}>
            {!isVerified && (
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 mt-1 cursor-pointer accent-emerald-600"
                  />
                  <label htmlFor="confirm" className="text-gray-700 text-sm font-medium cursor-pointer">
                    I confirm that the information above is correct
                  </label>
                </div>

                {isMinor && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="guardian"
                      checked={guardianChecked}
                      onChange={(e) => setGuardianChecked(e.target.checked)}
                      className="w-5 h-5 mt-1 cursor-pointer accent-emerald-600"
                    />
                    <label htmlFor="guardian" className="text-gray-700 text-sm font-medium cursor-pointer">
                      I will provide a guardian ID for verification (required for minors)
                    </label>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!canVerify || isVerified}
              className={`w-full py-3 font-semibold rounded-lg transition-all ${
                isVerified
                  ? "bg-green-500 text-white cursor-default"
                  : canVerify
                  ? "bg-teal-800 text-white hover:bg-teal-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isVerified ? "✓ Verified" : "Verify"}
            </button>
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      <Verify
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        onSubmit={handlePinSubmit}
      />
      <AdditionalInfo
        isOpen={showAdditional}
        onClose={() => setShowAdditional(false)}
        alertMessage="Please fill in your additional info before submitting a request."
      />
    </>
  );
}

export default Requests;