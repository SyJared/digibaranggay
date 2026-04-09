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
        setUsers(result.data);
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
