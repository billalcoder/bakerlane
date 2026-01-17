import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import { ShopProvider } from '../context/ShopContext.jsx'

// 🔹 Lazy-loaded components
const App = lazy(() => import('./App.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const CustomerLayout = lazy(() => import('./layout/HomeLayout.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const ShopDetails = lazy(() => import('./pages/ShopDetails.jsx'))
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'))
const Order = lazy(() => import('./pages/Order.jsx'))
const SearchResults = lazy(() => import('./pages/SearchResults.jsx'))
const Settings = lazy(() => import('./pages/setting.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

// 🔹 Loader UI
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
    Loading...
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    ),
    errorElement: <div className="p-10 text-center">404 - Page Not Found</div>,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      {
        path: "register",
        element: (
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        )
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        )
      },

      {
        path: "home",
        element: (
          <Suspense fallback={<Loader />}>
            <CustomerLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            )
          },
          {
            path: "shop/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <ShopDetails />
              </Suspense>
            )
          },
          {
            path: "product/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <ProductDetails />
              </Suspense>
            )
          },
          {
            path: "order",
            element: (
              <Suspense fallback={<Loader />}>
                <Order />
              </Suspense>
            )
          },
          {
            path: "search",
            element: (
              <Suspense fallback={<Loader />}>
                <SearchResults />
              </Suspense>
            )
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            )
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            )
          }
        ]
      }
    ],
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  </StrictMode>
)
