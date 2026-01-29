import React, { useState, useEffect, useCallback } from 'react';
import ShopCard from '../components/ShopCard';
import { Loader2, ChevronDown } from 'lucide-react';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locationDenied, setLocationDenied] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // 1. Fetch Function - Simplified dependencies
  const fetchShops = useCallback(async (lat, lng, targetPage) => {
    try {
      setLoading(true);
      const baseUrl = `${import.meta.env.VITE_BASEURL}/shop/get`;
      const params = new URLSearchParams({
        page: targetPage.toString(),
        limit: "10"
      });

      if (lat && lng) {
        params.append("latitude", lat);
        params.append("longitude", lng);
      }

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        // If targetPage is 1, we reset the list. Otherwise, append.
        setShops(prev => targetPage === 1 ? data.shops : [...prev, ...data.shops]);
        
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies because it uses internal logic and args

  // 2. Initial Trigger
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      fetchShops(null, null, 1);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          fetchShops(latitude, longitude, 1);
        },
        () => {
          setLocationDenied(true);
          fetchShops(null, null, 1);
        }
      );
    }
  }, [fetchShops]);

  // 3. Manual Pagination Handler
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchShops(coords.lat, coords.lng, nextPage);
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
          Fresh from the <span className="text-amber-600">Oven</span>
        </h1>
        {locationDenied && (
          <p className="text-sm text-yellow-600 mt-2">
            📍 Location denied - showing shops near you
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6">
        {shops.map((shopData, index) => (
          <ShopCard key={shopData.shop?._id || index} shop={shopData} />
        ))}
      </div>

      {/* Pagination Button Section */}
      <div className="mt-12 flex flex-col items-center justify-center pb-10">
        {loading ? (
          <div className="flex items-center text-stone-500">
            <Loader2 className="animate-spin mr-2 text-amber-600" size={24} />
            Fetching more bakeries...
          </div>
        ) : page < totalPages ? (
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-white border-2 border-amber-600 text-amber-600 px-8 py-2.5 rounded-full font-bold hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronDown size={20} />
            Load More Shops
          </button>
        ) : shops.length > 0 ? (
          <p className="text-stone-400 text-sm italic">You've seen all the bakers in this area!</p>
        ) : (
          !loading && <p className="text-stone-500">loading.</p>
        )}
      </div>
    </div>
  );
};

export default Home;