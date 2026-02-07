import { createContext, useEffect, useState } from "react";

export const RegisteredContext = createContext({
  registered: [],
  setRegistered: () => {},
  error: ''
});

export function RegisteredProvider({children}){
const [registered, setRegistered] = useState([]);
const [error, setError] = useState("");

   useEffect(() => {
    fetch("http://localhost/digibaranggay/showtable.php")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data.length > 0) {
          setRegistered(result.data);
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

  return(
    <RegisteredContext.Provider value={{ registered, setRegistered, error }}>
          {children}
        </RegisteredContext.Provider>
  )
}