import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, ListOrdered, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASEURL}/order/me`,
          {
            credentials: "include", // 🔴 REQUIRED for session cookies
          }
        );

        if (res.ok) {
          setIsLoggedIn(true);   // session exists
        } else {
          setIsLoggedIn(false);  // no session
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-amber-600 font-extrabold text-xl md:text-2xl shrink-0">
          <ShoppingBag size={24} strokeWidth={2.5} />
          <span className="hidden md:inline">BakerApp</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-3 flex items-center text-stone-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                navigate(`/home/search?q=${query}`);
              }
            }}
            placeholder="Search for cakes, pastries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-100
              focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">

          <Link
            to="/home/order"
            className="w-10 h-10 bg-stone-100 flex items-center justify-center
              text-stone-600 hover:bg-amber-100 hover:text-amber-700 border border-stone-200 rounded-full"
          >
            <ListOrdered size={18} />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center
                text-stone-600 hover:bg-amber-100 hover:text-amber-700 border border-stone-200"
            >
              <User size={20} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden">

                {!isLoggedIn ? (
                  /* -------- BEFORE LOGIN -------- */
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <User size={16} /> Login
                  </Link>
                ) : (
                  /* -------- AFTER LOGIN -------- */
                  <>
                    <Link
                      to="/home/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/home/order"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <ListOrdered size={16} /> My Orders
                    </Link>

                    <Link
                      to="/home/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <Settings size={16} /> Settings
                    </Link>

                    <div className="h-px bg-stone-100"></div>

                    <button
                      onClick={async () => {
                        await fetch(`${import.meta.env.VITE_BASEURL}/auth/logout`, {
                          method: "POST",
                          credentials: "include",
                        });
                        setIsLoggedIn(false);
                        setOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
