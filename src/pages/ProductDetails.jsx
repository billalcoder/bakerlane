import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // <--- Import Hook
import {
    ArrowLeft,
    Star,
    Store,
    Share2,
    Info
} from 'lucide-react';

// --- FETCH FUNCTION ---
const fetchProductDetails = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/product/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch product");
    return data.product || data.data;
};

// --- ORDER FUNCTION ---
const placeOrderApi = async (productId) => {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/create`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ productId }),
    });
    return await res.json();
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation(); // <--- Data passed from Shop Page

    // --- 1. PRODUCT QUERY (Smart Caching) ---
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', String(id)], // Unique Box for this product
        queryFn: () => fetchProductDetails(id),
        
        // 🚀 MAGIC FIX: Use data from Shop Page immediately!
        // If 'state' exists, we use it. If not (e.g. refresh), we fetch.
        initialData: state?.product || state, 
        
        staleTime: 5 * 60 * 1000, // 5 Minutes
        gcTime: 10 * 60 * 60 * 24, // 24 Hours
    });

    // --- 2. REVIEWS QUERY ---
    const { data: reviews = { data: [] } } = useQuery({
        queryKey: ['product_reviews', String(id)],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/review/product/${id}`);
            return await res.json();
        },
        staleTime: 5 * 60 * 1000,
    });

    // Local state for actions
    const [ordering, setOrdering] = useState(false);

    // --- HANDLERS ---
    const handlePlaceOrder = async () => {
        setOrdering(true);
        try {
            const data = await placeOrderApi(id);
            if (data.error === "Please add your address") return navigate("/add-address");
            if (!data.success) return alert(data.message || data.error);
            alert("Order placed successfully! The baker will be notified.");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setOrdering(false);
        }
    };

    const handleBuyNow = () => {
        const hasCoords = localStorage.getItem("coords"); // Ensure you use the same key everywhere
        
        if (!hasCoords) {
            if (confirm("Allow location access to find nearby bakers?")) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        localStorage.setItem("coords", JSON.stringify({ latitude, longitude }));
                        if (confirm(`Location saved! Order ${product.productName}?`)) handlePlaceOrder();
                    },
                    () => alert("Location required.")
                );
            }
            return;
        }

        if (confirm(`Are you sure you want to place an order for ${product.productName}?`)) {
            handlePlaceOrder();
        }
    };

    // --- LOADING UI ---
    if (isLoading && !product) return (
        <div className="min-h-screen flex items-center justify-center text-stone-400">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-stone-200 rounded-full mb-2"></div>
                Loading Deliciousness...
            </div>
        </div>
    );

    if (isError || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-stone-500 gap-4">
            <h2 className="text-xl font-bold">Product Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline">Go Back</button>
        </div>
    );

    const shop = typeof product.shopId === 'object' ? product.shopId : null;
    const shopId = shop ? shop._id : product.shopId;

    return (
        <div className="bg-stone-50 min-h-screen font-sans pb-20 animate-fade-in">
            {/* Top Navigation */}
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center text-stone-500 hover:text-amber-600 transition-colors text-sm font-bold p-4">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
            </div>

            <Link to={`/home/shop/${shopId}`} className="flex w-fit mx-4 items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-700 rounded-full transition-all text-sm font-semibold border border-stone-200">
                <Store size={16} /> Visit Shop
            </Link>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-6">
                
                {/* --- IMAGE --- */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 relative group">
                        <img
                            src={product.images?.[0] || product.imageUrl || "https://placehold.co/600"}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-xl transform -rotate-12">OUT OF STOCK</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- DETAILS --- */}
                <div className="flex flex-col h-full">
                    <div className="border-b border-stone-200 pb-6 mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{product.category}</span>
                            <button className="text-stone-400 hover:text-amber-600 transition-colors"><Share2 size={20} /></button>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 mb-4 leading-tight">{product.productName}</h1>

                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-extrabold text-amber-600">₹{product.price}</span>
                            <span className="text-stone-400 text-sm mb-1.5 font-medium">{product.unitType === "kg" ? `${product.unitValue}` : `for ${product.unitValue} items`}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-stone-900 uppercase mb-2">Description</h3>
                        <p className="text-stone-600 leading-relaxed text-lg">{product.productDescription || "No description provided."}</p>
                    </div>

                    <div className="mt-auto bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 items-start">
                            <Info className="text-amber-600 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-amber-800 leading-relaxed">
                                Order requests are sent directly to the baker. Once accepted, you'll receive their contact details.
                            </p>
                        </div>

                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock <= 0 || ordering}
                            className={`w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold
                            hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center justify-center gap-2
                            ${(ordering || product.stock <= 0) ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {ordering ? "Processing..." : "Order Now"}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- REVIEWS --- */}
            <div className="max-w-7xl mx-auto px-4 mt-12 mb-10">
                <h3 className="text-sm font-bold text-stone-900 uppercase mb-4">Customer Reviews</h3>
                {reviews.data && reviews.data.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.data.map((review, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <p className="font-bold text-stone-800">{review.userId?.name || "User"}</p>
                                    <div className="flex">{[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={14} className={idx < review.rating ? "text-amber-500 fill-amber-500" : "text-stone-300"} />
                                    ))}</div>
                                </div>
                                <p className="text-stone-600 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;