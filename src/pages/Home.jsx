import React from 'react';
import ShopCard from '../components/ShopCard';
import { Loader2 } from 'lucide-react'; // Optional: for a nice spinner
import { useShop } from '../../context/ShopContext'
const Home = () => {
  // Get data directly from Context
  const { shops, loading, locationDenied } = useShop();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin text-amber-600" size={40} />
            <span className="ml-2 text-stone-500">Finding the best bakers...</span>
        </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
          Fresh from the <span className="text-amber-600">Oven</span>
        </h1>

        <p className="text-stone-500 max-w-xl mx-auto">
          Discover the best local home bakers and artisan shops near you.
        </p>

        {locationDenied && (
          <p className="text-sm text-yellow-600 mt-3">
            📍 Location access denied — showing popular shops
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6">
        {shops.map(shop => (
          <ShopCard key={shop._id} shop={shop} />
        ))}
      </div>
      
      {/* Handle empty state if needed */}
      {!loading && shops.length === 0 && (
          <div className="text-center text-stone-400 mt-10">
              No shops found in this area yet.
          </div>
      )}
    </div>
  );
};

export default Home