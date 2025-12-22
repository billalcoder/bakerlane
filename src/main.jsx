import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CustomerLayout from './layout/HomeLayout.jsx';
import Home from './pages/Home.jsx';
import ShopDetails from './pages/ShopDetails.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import { Order } from './pages/Order.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Settings from './pages/setting.jsx';
import Profile from './pages/profile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div className="p-10 text-center">404 - Page Not Found</div>,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {
        path: "home",
        element: <CustomerLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "shop/:id", element: <ShopDetails /> },
          { path: "product/:id", element: <ProductDetails /> },
          { path: "order", element: <Order /> },
          { path: "search", element: <SearchResults /> },
          { path: "settings", element: <Settings /> },
          { path: "profile", element: <Profile /> },
        ]
      }
    ],
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
