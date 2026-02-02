import React, { useEffect, useState } from "react";
function Manageusers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost/digibaranggay/showtable.php")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data.length > 0) {
          setUsers(result.data);
          setError("");
        } else {
          setError("No data found");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const toggleExpand = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };
  

  return (
    <div className="flex flex-col gap-4 p-6 md:p-9 bg-gradient-to-br from-slate-50 to-slate-100  max-h-max">
      {error && <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">{error}</p>}

        {users.map(user => {
        const isExpanded = expandedUserId === user.id;

        return (
          <div
            key={user.id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-emerald-600 ${isExpanded ? 'shadow-md border-emerald-600' : ''}`}
            onClick={() => toggleExpand(user.id)}
          >
            <div className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-semibold text-lg text-slate-900">{user.firstname} {user.middlename} {user.lastname}</div>
                <div className="text-sm text-slate-500 mt-1">{user.address}</div>
              </div>
              <div className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'text-emerald-600 rotate-180' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 10 13 14 9"></polyline>
                </svg>
              </div>
            </div>
            
{//expand
        }
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-200 p-5 space-y-3">
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Email :</span> 
                  <span className="text-slate-900 text-right flex-1">{user.email}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Password :</span>
                  <span className="text-slate-900 text-right flex-1">{user.password}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Address :</span>
                  <span className="text-slate-900 text-right flex-1">{user.address}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Birthdate :</span>
                  <span className="text-slate-900 text-right flex-1">{user.birthdate}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">CivilStatus :</span>
                  <span className="text-slate-900 text-right flex-1">{user.civilstatus}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Contact number :</span>
                  <span className="text-slate-900 text-right flex-1">{user.contactnumber }</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-3">
                  <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">Gender :</span>
                  <span className="text-slate-900 text-right flex-1">{user.gender}</span>
                </div>
                <div className="flex gap-3 mt-5 pt-4 border-t border-emerald-200">
                  <button className="flex-1 font-medium text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">Edit</button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95">Delete</button>
                </div>
              </div>
            </div>
          </div>
        );
      })} 
      
    </div>
  );
}

export default Manageusers;