import { createContext, useState } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [cartData, setCartData] = useState([]);

  return (
    <AppContext.Provider value={{

      login, setLogin,
      cartData, setCartData
      
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };