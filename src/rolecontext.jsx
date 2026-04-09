import { createContext, useState, useEffect } from "react";

export const RoleContext = createContext({
  user: undefined, // undefined = still loading
  role: "",
  setUser: () => {},
  setRole: () => {},
});

export function RoleProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/checkAuth.php`, {
      credentials: "include", // important for PHP session cookies
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setRole(data.user.role);
        } else {
          setUser(null);
          setRole("");
        }
      })
      .catch(() => {
        setUser(null);
        setRole("");
      });
  }, []);

  return (
    <RoleContext.Provider value={{ user, role, setUser, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}