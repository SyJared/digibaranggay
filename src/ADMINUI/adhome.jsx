import { useContext, useState } from "react";
import Manageusers from "./manageusers";
import Requestees from "./requestees";
import Records from "./records";
import Announcement from "./announcement";

import { Newspaper, Megaphone, Users, FileText } from "lucide-react"; 
import { RequestContext } from "../requestList";
import StatCard from "./overview";
import { AnnouncementContext } from "../announcementList";
import { RegisteredContext } from "../registeredContext";
import ActivityHeatmap from "./activityHeatMap";

function Adhome() {
  const {users} = useContext(RequestContext);
  const {announcement} = useContext(AnnouncementContext);
  const {registered, error} = useContext(RegisteredContext)

  const [active, setActive] = useState("Requests");

  const handleMainClick = (item) => {
    setActive(item);
  };

  return (
    <div className="min-h-screen bg-white p-6 mt-16">

 
      <div className="flex gap-4 mb-6">
        {[
          { name: "Requests", icon: Newspaper },
          { name: "Make announcement", icon: Megaphone },
          { name: "Manage Users", icon: Users },
          { name: "Records", icon: FileText },
        ].map((nav) => (
          <button
            key={nav.name}
            onClick={() => handleMainClick(nav.name)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold justify-center transition-colors w-full ${
              active === nav.name
                ? "bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-teal-500"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <nav.icon className="w-6 h-6" /> 
            {nav.name}
          </button>
        ))}
      </div>



     
      {active === "Requests" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-[800px] mx-auto">
    <StatCard label="Total" value={users.length} />
    <ActivityHeatmap users={users} />
  </div>
)}


        {active === "Make announcement" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-[600px] mx-auto">
        <StatCard label="Total" value={announcement.length} />
        <StatCard label="Urgent" value={2} />
      </div>
        )}

        {active === "Manage Users" && (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 max-w-[900px] mx-auto">
    <StatCard
      label="Total Accepted"
      value={registered.filter(r => r.status === 'Accepted').length}
      tone="slate"
    />
    <StatCard
      label="Male"
      value={registered.filter(r => r.gender === 'Male' && r.status === 'Accepted').length}
      tone="teal"
    />
    <StatCard
      label="Female"
      value={registered.filter(r => r.gender === 'Female' && r.status === 'Accepted').length}
      tone="pink"
    />
    <StatCard
      label="Pending"
      value={registered.filter(r => r.status === 'Pending').length}
      tone="yellow"
    />
  </div>
)}



        {active === "Records" && (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 max-w-[1000px] mx-auto">
        <StatCard label="Total" value={users.length} />
       <StatCard label="Pending" value={users.filter(u => u.status === 'Pending').length} tone="amber" />
<StatCard label="Approved" value={users.filter(u => u.status === 'Approved').length} tone="emerald" />
<StatCard label="Rejected" value={users.filter(u => u.status === 'Rejected').length} tone="red" />
<StatCard label="Expired" value={users.filter(u => u.status === 'Expired').length} tone="purple" />
        
      </div>

        )}

     
      <div className="bg-gray-50 border-e-3 border-l-3 shadow-md border-teal-800 rounded-xl  overflow-scroll no-scrollbar mx-20 max-h-[600px]">
        {active === "Manage Users" && <Manageusers />}
        {active === "Requests" && <Requestees />}
        {active === "Records" && <Records />}
        {active === "Make announcement" && <Announcement />}
        {!active && (
          <div className="text-center text-gray-500 text-lg">
            Select a section from the nav above to see overview and content.
          </div>
        )}
      </div>
    </div>
  );
}

export default Adhome;
