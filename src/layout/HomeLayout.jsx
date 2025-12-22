import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { ShoppingCart } from 'lucide-react';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col relative">
      
      {/* 1. Header (Sticky at top) */}
      <Header />

      {/* 2. Main Content Area */}
      {/* The <Outlet /> renders the child route (e.g., Home, Shop Details) */}
      <main className="flex-grow w-full max-w-7xl mx-auto">
        <Outlet />
      </main>


      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-center text-stone-400 text-sm mt-auto">
        <p>© 2025 BakerApp. Freshly baked for you.</p>
      </footer>
    </div>
  );
};

export default CustomerLayout;