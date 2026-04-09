import { createContext, useEffect, useState } from "react";

export const RegisteredContext = createContext({
  registered: [],
  emergencyInfo: {},   
  additionalInfo: {}, // key = user ID, value = {height, weight, tin}
  setRegistered: () => {},
  setAdditionalInfo: () => {},
  error: ""
});

export function RegisteredProvider({ children }) {
  const [registered, setRegistered] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [emergencyInfo, setEmergencyInfo] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/showtable.php`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data.length > 0) {
          setRegistered(result.data);

          // normalize additional info by ID
          const infoObj = {};
          result.data.forEach(user => {
            // ensure IDs are numbers for consistent object keys
            const id = Number(user.id);
            infoObj[id] = {
              height: user.height || "",
              weight: user.weight || "",
              tin: user.tin || "",
              position: user.position || "",
              employer: user.employer || ""
            };
          });

          setAdditionalInfo(infoObj);
          const emergencyObj = {};
          result.data.forEach(user => {
            const id = Number(user.id);
            emergencyObj[id] = {
              emergency_name: user.emergency_name || "",
              emergency_address: user.emergency_address || "",
              emergency_relation: user.emergency_relation || "",
              emergency_contact: user.emergency_contact || "",
            };
          });
          setEmergencyInfo(emergencyObj);
          setError("");
        } else {
          setError("No data found");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch data");
      });
  }, []);

  return (
    <RegisteredContext.Provider value={{ registered, additionalInfo, setRegistered, emergencyInfo ,setAdditionalInfo, error }}>
      {children}
    </RegisteredContext.Provider>
  );
}