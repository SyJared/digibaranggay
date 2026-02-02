import { useContext, useState } from "react";
import { CreditCard, Home, Shield, FileText, UserRoundCheck, Briefcase, Check, X, SquareArrowRight, IdCard, FileCheck} from 'lucide-react';
import RequestBubble from "./requestbubble";
import PersonalInfoModal from "./personalInfoModal";
import { RequestContext } from "../requestList";

function Requests(){
  
  const {users} =useContext(RequestContext)
  const [transaction, setTransaction] = useState('KKID Card');
  const [message, setMessage] = useState('');
  const [purpose, setPurpose] = useState('')
  const [active, setActive] = useState('KKID Card');
  const [isVerified, setIsVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClick = async () => {
  if (!transaction) {
    setMessage("Please select a transaction");
    return;
  }

  if (!purpose.trim()) {
    setMessage("Please enter a purpose");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost/digibaranggay/request.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction,
          purpose,
          user
        }),
      }
    );

    const data = await res.json();
    console.log("Response from PHP:", data);

    if (data.success) {
      setMessage(data.message);
    } else {
      setMessage(data.message || "Something went wrong");
    }

  } catch (error) {
    console.error(error.message);
    setMessage(error.message);
  }
};
const cardClick =(card)=>{
  setTransaction(card);
  setActive(card);
  setMessage('');
}
const color = {
  'Pending': 'text-orange-600',
  'Approved': 'text-green-600',
  'Rejected': 'text-rose-600'
}

const payment = {
  'KKID Card': 0.00,
  'Brgy. clearance': 50.00,
  'Certificate of indigency': 0.00,
  'Barangay ID': 50.00,
  'Working clearance': 0.00,
  'OSCA': 0.00,
  'First job seeker': 0.00,
  'Barangay inhabitants':0.00
};

const iconMap = {
  'KKID Card': CreditCard,
  'Brgy. clearance': UserRoundCheck,
  'Certificate of indigency': Shield,
  'OSCA': FileText,
  'Barangay inhabitants': Home,
  'First job seeker': Briefcase,
  'Barangay ID': IdCard,
  'Working clearance': FileCheck
};
const cards = [
  {card:'KKID Card'}, 
  {card:'Brgy. clearance'}, 
  {card:'Certificate of indigency'}, 
  {card:'Working clearance'}, 
  {card:'OSCA'}, 
  {card:'First job seeker'},
  {card:'Barangay inhabitants'},
  {card:'Barangay ID'}
];
const name = user.firstname + ' ' + user.middlename +' ' + user.lastname;

const existingRequest = users?.find(
  (req) =>
    String(req.id) === String(user.id) &&
    req.transaction === transaction
);

const handleVerify = () => {
    if (isChecked) {
      setIsVerified(true);
      setMessage("Information verified successfully!");
      setTimeout(() => setMessage(''), 3000);
      console.log(users)
    }
  };
  return(
   <>

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
              ? 'primary-color text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-teal-700'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {Icon && <Icon size={28} />}
          <span className="text-sm font-semibold text-center">{c.card}</span>
        </button>
      );
    })}
  </div>

  <div className="flex flex-col lg:flex-row gap-6 max-w-[1300px] mx-auto mt-6">

    <div className="relative flex-1 bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-4 max-h-[420px]">
      <h1 className="text-2xl font-bold text-gray-900">{transaction}</h1>

      {existingRequest && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm bg-white/50`}>
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
          {`${payment[transaction]} `}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          disabled={!isVerified && !isChecked}
          onClick={handleClick}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            isVerified
              ? 'primary-color text-white hover:opacity-95 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Request
        </button>
        {message && <p className="text-green-600 font-semibold">{message}</p>}
      </div>

      {!isVerified && (
        <div className="flex justify-center animate-slide-right">
          <SquareArrowRight size={32} className="text-teal-600" strokeWidth={1.5} />
        </div>
      )}
    </div>


    <div className="flex-1 flex flex-col gap-4">
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
        </div>

        <div className="text-center text-sm font-medium text-teal-600 cursor-pointer hover:underline">
          Information incorrect? Click here
        </div>
      </div>


      <div
        className={`rounded-xl shadow-lg p-6 transition-all duration-500 ${
          isVerified
            ? 'bg-green-50 border border-green-300'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className={`font-bold text-lg ${isVerified ? 'text-green-600' : 'text-gray-900'}`}>
            {isVerified ? '✓ Verify your information' : 'Verify your information'}
          </p>
          {isVerified && (
            <div className="flex gap-2 items-center">
              <div className="bg-green-500 text-white rounded-full p-1 animate-bounce">
                <Check size={20} />
              </div>
              <button
                onClick={() => {
                  setIsVerified(false);
                  setIsChecked(false);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                title="Unverify"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

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
              ? 'bg-green-500 text-white cursor-default'
              : isChecked
              ? 'bg-teal-800 text-white hover:bg-teal-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isVerified ? '✓ Verified' : 'Verify'}
        </button>

        {isVerified && (
          <p className="text-green-600 text-sm font-semibold mt-3 text-center animate-fadeIn">
            Your information has been verified and confirmed.
          </p>
        )}
      </div>
    </div>
  </div>

  <RequestBubble />
</>

  )
}
export default Requests;