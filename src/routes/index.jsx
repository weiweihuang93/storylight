import FrontLayout from "../front/FrontLayout";
import HomePage from "../front/HomePage";
import NewsPage from "../front/NewsPage";
import CategoryPage from "../front/CategoryPage";
import ProductPage from "../front/ProductPage";
import WishPage from "../front/WishPage";
import HelpPage from "../front/HelpPage";
import Login from "../front/Login";
import Register from "../front/Register";
import CartLayout from "../front_cart/CartLayout";
import CartPage from "../front_cart/CartPage";
import OrderPage from "../front_cart/OrderPage";
import PaymentPage from "../front_cart/PaymentPage";
import CompletePage from "../front_cart/CompletePage";

const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'category/:categoryName', element: <CategoryPage /> },
      { path: 'category/:categoryName/:id', element: <ProductPage /> },
      { path: 'wish', element: <WishPage /> },
      { path: 'help', element: <HelpPage /> },
      { 
        path: 'cart', element: <CartLayout />,
        children: [
          { path: '', element: <CartPage /> },
          { path: 'order', element: <OrderPage /> },
          { path: 'payment', element: <PaymentPage /> },
          { path: 'complete', element: <CompletePage /> }
        ]
       }
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];

export default routes;