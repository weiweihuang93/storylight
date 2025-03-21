import { createContext, useState } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [login, setLogin] = useState(false);

  return (
    <AppContext.Provider value={{

      login, setLogin
      
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };