import { createContext, useEffect, useState } from "react";

export const RequestContext = createContext({
  users: [],
  setUsers:  () => {},
  listingError: '',
  setListingError: () => {}
});

export function RequestProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [listingError, setListingError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requestees.php`);
      const result = await res.json();
      if (result.success) {
      const cleaned = (result.data || []).map((u) => ({
        ...u,
        
        name: u.name?.trim() || "-",
        
        status: u.status?.trim() || "-",
        transaction: u.transaction?.trim() || "-",

        created_at: u.created_at ?? "-",
        date: u.date ?? "-",
        dateupdated: u.dateupdated ?? "-",
      }));

      setUsers(cleaned);
    } else {
        setListingError(result.message);
      }
    } catch (err) {
      setListingError('Failed to fetch');
    }
  };

  useEffect(() => {
    fetchRequests();

    const interval = setInterval(fetchRequests, 5000); // fetch every 15 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <RequestContext.Provider value={{ users,setUsers, listingError, setListingError }}>
      {children}
    </RequestContext.Provider>
  );
}
