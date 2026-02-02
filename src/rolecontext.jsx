import { createContext, useState } from "react";


export const RoleContext = createContext({
  role: '',
  setRole: () => {},
  user: null
});


export function RoleProvider({ children }) {

  const stored = localStorage.getItem('user');
  const parsed = stored ? JSON.parse(stored) : null;

  const [role, setRole] = useState(parsed?.role || '');
  
  return (
    <RoleContext.Provider value={{ role, setRole, user: parsed }}>
      {children}
    </RoleContext.Provider>
  );
}
