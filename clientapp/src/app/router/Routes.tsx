import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import DailyMenu from "../../features/menu/DailyMenu";
import FoodDetails from "../../features/catalog/FoodDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Catalog from "../../features/catalog/Catalog";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <FoodDetails /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '', element: <DailyMenu /> },
    ]
  }
])
