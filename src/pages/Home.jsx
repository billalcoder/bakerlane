import React, { useState, useEffect } from 'react';
import ShopCard from '../components/ShopCard';
import { Loader2, ChevronDown } from 'lucide-react';
// 1. Import the hook
import { useInfiniteQuery } from '@tanstack/react-query';

const Home = () => {
  // We only need state for location now. Data state is handled by React Query.
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locationDenied, setLocationDenied] = useState(false);

  // 2. Define the Fetch Function
  // React Query passes 'pageParam' automatically for pagination
  const fetchShopsApi = async ({ pageParam = 1 }) => {
    const baseUrl = `${import.meta.env.VITE_BASEURL}/shop/get`;
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: "10"
    });

    // Only append lat/lng if they exist
    if (coords.lat && coords.lng) {
      params.append("latitude", coords.lat);
      params.append("longitude", coords.lng);
    }

    const res = await fetch(`${baseUrl}?${params.toString()}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  };

  // 3. The Magic Hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch // Used to reload when location changes
  } = useInfiniteQuery({
    queryKey: ['shops', coords], // If coords change, the list clears and refetches automatically!
    queryFn: fetchShopsApi,
    getNextPageParam: (lastPage) => {
      // Check your API response structure for totalPages/currentPage
      // Assuming structure: { pagination: { currentPage: 1, totalPages: 5 } }
      const { currentPage, totalPages } = lastPage.pagination || {};
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // 4. Handle Geolocation (Side Effect)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }
    
    // We don't block fetching here. The query runs immediately with null coords.
    // When this callback runs later, it updates state, triggering a background refetch.
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn("Location denied or error:", err);
        setLocationDenied(true);
      }
    );
  }, []);

  // Helper to flatten the data (React Query stores it in 'pages' array)
  // Page 1 => data.pages[0].shops
  // Page 2 => data.pages[1].shops
  const allShops = data?.pages.flatMap(page => page.shops) || [];

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
        {status === 'pending' ? (
           // Initial Loading Skeleton could go here
           <div className="col-span-full text-center text-stone-400">Loading delicious shops...</div>
        ) : status === 'error' ? (
           <div className="col-span-full text-center text-red-500">Error loading shops.</div>
        ) : (
          allShops.map((shopData, index) => (
            <ShopCard key={shopData.shop?._id || index} shop={shopData} />
          ))
        )}
      </div>

      {/* Pagination Button Section */}
      <div className="mt-12 flex flex-col items-center justify-center pb-10">
        {isFetchingNextPage ? (
          <div className="flex items-center text-stone-500">
            <Loader2 className="animate-spin mr-2 text-amber-600" size={24} />
            Fetching more bakeries...
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="flex items-center gap-2 bg-white border-2 border-amber-600 text-amber-600 px-8 py-2.5 rounded-full font-bold hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronDown size={20} />
            Load More Shops
          </button>
        ) : allShops.length > 0 ? (
          <p className="text-stone-400 text-sm italic">You've seen all the bakers in this area!</p>
        ) : null}
      </div>
    </div>
  );
};

export default Home;