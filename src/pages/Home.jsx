import React, { useState, useEffect } from 'react';
import ShopCard from '../components/ShopCard';
import { Loader2, ChevronDown, MapPin, Search } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';

const Home = () => {
  // 1. GET COORDS FROM STORAGE (Instant Load if returning)
  const getStoredCoords = () => {
    try {
      const saved = sessionStorage.getItem("user_coords");
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  };

  const [coords, setCoords] = useState(getStoredCoords);
  const [locationDenied, setLocationDenied] = useState(false);
  
  // 2. NEW STATE: Are we currently waiting for GPS?
  // If we have stored coords, we are NOT locating. If we don't, we ARE locating.
  const [isLocating, setIsLocating] = useState(!getStoredCoords());

  // 3. GET LOCATION (The "Waiting" Phase)
  useEffect(() => {
    // If we already have coords from storage, stop here.
    if (coords) return; 

    if (!navigator.geolocation) {
      setLocationDenied(true);
      setIsLocating(false); // Stop waiting, show generic
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude 
          };
          setCoords(newCoords);
          sessionStorage.setItem("user_coords", JSON.stringify(newCoords));
          setIsLocating(false); // ✅ STOP WAITING, SHOW DATA
        },
        (err) => {
          console.warn("Location failed", err);
          setLocationDenied(true);
          setIsLocating(false); // ✅ STOP WAITING, SHOW GENERIC
        },
        { timeout: 8000 } // Wait max 8 seconds for GPS
      );
    }
  }, []);

  // 4. FETCH SHOPS (React Query)
  const fetchShops = async ({ pageParam = 1 }) => {
    const baseUrl = `${import.meta.env.VITE_BASEURL}/shop/get`;
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: "10"
    });

    if (coords) {
      params.append("latitude", coords.lat);
      params.append("longitude", coords.lng);
    }

    const res = await fetch(`${baseUrl}?${params.toString()}`);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // Note: We use our own 'isLocating' state for the initial load
    isLoading: isQueryLoading 
  } = useInfiniteQuery({
    queryKey: ['shops', coords], 
    queryFn: fetchShops,
    getNextPageParam: (lastPage) => {
      const current = lastPage.pagination?.currentPage || 1;
      const total = lastPage.pagination?.totalPages || 1;
      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !isLocating, // 🛑 PAUSE FETCHING UNTIL LOCATION IS DONE
    staleTime: 1000 * 60 * 5,
  });

  const allShops = data?.pages.flatMap(page => page.shops) || [];

  // --- 5. THE LOADING SCREEN (What you asked for) ---
  if (isLocating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in px-4 text-center">
        <div className="bg-amber-100 p-6 rounded-full mb-6 relative">
             <MapPin size={48} className="text-amber-600 animate-bounce" />
             <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-sm">
                <Loader2 size={20} className="animate-spin text-stone-400"/>
             </div>
        </div>
        <h2 className="text-2xl font-extrabold text-stone-800 mb-2">Finding nearby bakers...</h2>
        <p className="text-stone-500 max-w-xs">
            Hang tight! We are looking for the freshest cakes in your neighborhood.
        </p>
      </div>
    );
  }

  // --- 6. MAIN RENDER (After location is found or denied) ---
  return (
    <div className="py-8 animate-fade-in">
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
          Fresh from the <span className="text-amber-600">Oven</span>
        </h1>
        
        <div className="h-6 flex justify-center items-center text-sm">
            {locationDenied ? (
              <span className="text-stone-500 flex items-center gap-1">
                 📍 Location denied - showing all popular shops
              </span>
            ) : (
               <span className="text-green-600 font-medium flex items-center gap-1 animate-fade-in">
                 <MapPin size={14} /> Showing bakers near you
               </span>
            )}
        </div>
      </div>

      {isQueryLoading ? (
        <div className="flex flex-col justify-center items-center p-20 text-stone-400">
             {/* This only shows if location is found but API is still fetching */}
            <Loader2 className="animate-spin text-amber-600 mb-2" size={40} />
            <p>Loading the menu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6">
          {allShops.map((shopData, index) => (
            <ShopCard key={shopData.shop?._id || index} shop={shopData} />
          ))}
        </div>
      )}
      
      {!isQueryLoading && allShops.length === 0 && (
         <div className="text-center py-16 bg-stone-50 rounded-xl border border-stone-100 mx-4">
            <h3 className="text-lg font-bold text-stone-600 mb-2">No bakers found nearby</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
                We couldn't find any home bakers in your exact location.
            </p>
         </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex flex-col items-center justify-center pb-10">
        {isFetchingNextPage ? (
          <div className="flex items-center text-stone-500">
            <Loader2 className="animate-spin mr-2 text-amber-600" size={24} />
            Fetching more...
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="flex items-center gap-2 bg-white border-2 border-amber-600 text-amber-600 px-8 py-2.5 rounded-full font-bold hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronDown size={20} />
            Load More Shops
          </button>
        ) : allShops.length > 0 ? (
          <p className="text-stone-400 text-sm italic">You've reached the end!</p>
        ) : null}
      </div>
    </div>
  );
};

export default Home;