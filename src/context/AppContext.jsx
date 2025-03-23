import { createContext, useState } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [shippingAdd, setShippingAdd] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [orderId, setOrderId] = useState(null);

  return (
    <AppContext.Provider value={{

      login, setLogin,
      cartData, setCartData,
      shippingAdd, setShippingAdd,
      selectedCoupon, setSelectedCoupon,
      orderId, setOrderId
      
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };