import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");

  // 1. Location State (Start as null)
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locationDenied, setLocationDenied] = useState(false);

  // 2. Fetch Logic (Decoupled from component)
  const fetchSearchResults = async ({ queryKey }) => {
    const [_, searchQuery, currentCoords] = queryKey;
    
    // Build URL dynamically based on whether we have coords yet
    const baseUrl = `${import.meta.env.VITE_BASEURL}/search`;
    const urlParams = new URLSearchParams({ q: searchQuery });

    if (currentCoords.lat && currentCoords.lng) {
      urlParams.append("lat", currentCoords.lat);
      urlParams.append("lng", currentCoords.lng);
    }

    const res = await fetch(`${baseUrl}?${urlParams.toString()}`);
    const data = await res.json();
    return data.data || [];
  };

  // 3. React Query: Fetches IMMEDIATELY with null coords, then re-fetches if coords arrive
  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: ['search', query, coords], // <--- This dependency array does the magic
    queryFn: fetchSearchResults,
    enabled: !!query, // Only run if we have a query
    staleTime: 1000 * 60 * 5, // Cache results for 5 mins
    placeholderData: (prev) => prev // Keep showing old results while fetching new location-based ones
  });

  // 4. Get Location in Background (Fire and Forget)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Setting this triggers the re-fetch automatically!
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => setLocationDenied(true),
        { timeout: 5000 } // Don't wait forever
      );
    } else {
      setLocationDenied(true);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">
          Results for "<span className="text-amber-600">{query}</span>"
        </h2>
        
        {/* Status Indicators */}
        <div className="flex items-center gap-2 text-sm mt-2 h-6">
           {isFetching && coords.lat && (
              <span className="text-amber-600 flex items-center gap-1">
                 <Loader2 size={14} className="animate-spin"/> Refining with location...
              </span>
           )}
           {locationDenied && (
             <span className="text-stone-400 text-xs">📍 Location access denied</span>
           )}
           {coords.lat && !isFetching && (
             <span className="text-green-600 text-xs flex items-center gap-1">
               <MapPin size={12}/> Results sorted by distance
             </span>
           )}
        </div>
      </div>

      {isLoading && !results.length ? (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-amber-600" size={32} />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-stone-500 bg-stone-50 rounded-xl">
            <p>No delicious items found for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <Link
              key={product._id}
              to={`/home/product/${product._id}`}
              className="bg-white p-4 rounded-xl border border-stone-100 hover:shadow-lg hover:border-amber-100 transition-all group"
            >
              <div className="overflow-hidden rounded-lg h-48 w-full bg-stone-100 relative">
                 <img
                    src={product.images?.[0] || product.imageUrl || "https://placehold.co/300"}
                    loading="lazy" 
                    alt={product.productName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNearby && (
                    <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full shadow-sm font-bold">
                      Nearby
                    </span>
                  )}
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-stone-800 leading-tight">
                        {product.productName}
                    </h3>
                    <span className="font-bold text-amber-600">₹{product.price}</span>
                </div>

                <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                  By {product.shopId?.shopName || "Unknown Baker"}
                </p>

                {/* Distance Logic */}
                {product.distance !== undefined && (
                   <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                     <MapPin size={12} /> {product.distance.toFixed(1)} km away
                   </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;