import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  // 📍 Try to get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        setLocationDenied(true); // ❗ permission denied
      }
    );
  }, []);

  // 🔍 Fetch results (with or without location)
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);

      const url = location
        ? `${import.meta.env.VITE_BASEURL}/search?q=${query}&lat=${location.lat}&lng=${location.lng}`
        : `${import.meta.env.VITE_BASEURL}/search?q=${query}`;

      const res = await fetch(url);
      const data = await res.json();

      setResults(data.data || []);
      setLoading(false);
    };

    // Fetch when:
    // - location available
    // - OR location denied
    if (location || locationDenied) {
      fetchResults();
    }
  }, [query, location, locationDenied]);

  if (loading) return <p className="p-6">Searching...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">
        Search results for "{query}"
      </h2>

      {locationDenied && (
        <p className="text-sm text-yellow-600 mb-4">
          📍 Location access denied — showing all results
        </p>
      )}

      {results.length === 0 ? (
        <p>No items found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <Link
              key={product._id}
              to={`/home/product/${product._id}`}
              className="bg-white p-4 rounded-xl border hover:shadow-md"
            >
              <img
                src={product.images?.[0] || "https://placehold.co/300"}
                className="h-40 w-full object-cover rounded-lg"
              />

              <h3 className="font-bold mt-3">{product.productName}</h3>

              <p className="text-sm text-stone-500">
                {product.shopId?.shopName}
              </p>

              <p className="font-bold text-amber-600 mt-1">
                ₹{product.price}
              </p>

              {/* 📍 Distance (only if available) */}
              {product.distance !== undefined && (
                <p className="text-sm text-green-600 mt-1">
                  📍 {product.distance} km away
                </p>
              )}

              {product.isNearby && (
                <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-2">
                  Nearby
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
