import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [shippingAdd, setShippingAdd] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [favorites, setFavorites] = useState({});

  // 讀取 localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});
  }, []);

  // 每次 favorites 更新時，儲存到 localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <AppContext.Provider value={{

      login, setLogin,
      cartData, setCartData,
      shippingAdd, setShippingAdd,
      selectedCoupon, setSelectedCoupon,
      orderId, setOrderId,
      favorites, toggleFavorite
      
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };