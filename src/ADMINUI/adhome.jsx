import { useContext, useState } from "react";
import Manageusers from "./manageusers";
import Requestees from "./requestees";
import Records from "./records";
import Announcement from "./announcement";

import { Newspaper, Megaphone, Users, FileText } from "lucide-react"; // Lucide icons
import { RequestContext } from "../requestList";
import StatCard from "./overview";
import { AnnouncementContext } from "../announcementList";

function Adhome() {
  const {users} = useContext(RequestContext);
  const {announcement} = useContext(AnnouncementContext)

  const [active, setActive] = useState("");

  const handleMainClick = (item) => {
    setActive(item);
  };

  return (
    <div className="min-h-screen bg-white p-6 mt-16">

      {/* NAV PANEL — Full width buttons */}
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
            <nav.icon className="w-6 h-6" /> {/* Use Lucide icon as component */}
            {nav.name}
          </button>
        ))}
      </div>

      {/* SECTION OVERVIEW / ANALYTICS — smaller and themed */}
      {active === "Requests" && (
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 max-w-[300px] mx-auto">
        <StatCard label="Total" value={users.length} />
      </div>
        )}

        {active === "Make announcement" && (
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 max-w-[300px] mx-auto">
        <StatCard label="Total" value={announcement.length} />
      </div>
        )}

        {active === "Manage Users" && (
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 max-w-[300px] mx-auto">
        <StatCard label="Total" value={announcement.length} />
      </div>
        )}

      {/* MAIN CONTENT */}
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
