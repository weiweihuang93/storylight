import FrontLayout from "../front/FrontLayout";
import HomePage from "../front/HomePage";
import NewsPage from "../front/NewsPage";
import CategoryPage from "../front/CategoryPage";
import WishPage from "../front/WishPage";
import HelpPage from "../front/HelpPage";

const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'wish', element: <WishPage /> },
      { path: 'help', element: <HelpPage /> },
    ]
  }
];

export default routes;