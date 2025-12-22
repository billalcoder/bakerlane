import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BASEURL}/search?q=${query}`
      );
      const data = await res.json();
      setResults(data.data || []);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  if (loading) return <p className="p-6">Searching...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">
        Search results for "{query}"
      </h2>

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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
