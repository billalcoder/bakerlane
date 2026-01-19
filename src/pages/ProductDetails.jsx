import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Star,
    CheckCircle,
    Store,
    Share2
} from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    const API_BASE = import.meta.env.VITE_BASEURL; // e.g. http://localhost:5000/client

    // --- 1. FETCH PRODUCT DATA ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE}/shop/product/${id}`);
                const data = await res.json();

                if (data.success || data.product) {
                    setProduct(data.product || data.data);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        const review = async () => {
            const res = await fetch(`${API_BASE}/review/product/${id}`);
            const data = await res.json();
            console.log("review", data);
            setReviews(data)
        }

        fetchProduct();
        review()
    }, [id, API_BASE]);

    const handleBuyNow = async () => {
        const isYes = confirm(`Do you really what to make order to ${product.productName}`)
        if (isYes) {
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ productId: id }),
            })

            const data = await res.json()
            if (!data.success) {
                return alert(data.message || data.error)
            }
            alert("Your order will be send to the baker you will be notify ones accepted and you can view your orders in order tab avalable in header and the profile option")
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-stone-400">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-stone-200 rounded-full mb-2"></div>
                Loading Deliciousness...
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-stone-500 gap-4">
            <h2 className="text-xl font-bold">Product Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline">
                Go Back
            </button>
        </div>
    );

    // Safe access to nested shop data if populated
    const shop = typeof product.shopId === 'object' ? product.shopId : null;
    const shopId = shop ? shop._id : product.shopId;

    return (
        <div className="bg-stone-50 min-h-screen font-sans pb-20 animate-fade-in">

            {/* Top Navigation */}
            <div className=''>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-stone-500 hover:text-amber-600 transition-colors text-sm font-bold"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>

            </div>


            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                {/* --- LEFT COLUMN: IMAGE --- */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 relative group">
                        <img
                            src={product.images?.[0] || product.imageUrl || "https://placehold.co/600"}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-xl transform -rotate-12">
                                    OUT OF STOCK
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: DETAILS --- */}
                <div className="flex flex-col h-full">

                    {/* Header Info */}
                    <div className="border-b border-stone-200 pb-6 mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                {product.category}
                            </span>
                            <button className="text-stone-400 hover:text-amber-600 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 mb-4 leading-tight">
                            {product.productName}
                        </h1>

                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-extrabold text-amber-600">₹{product.price}</span>
                            <span className="text-stone-400 text-sm mb-1.5 font-medium">{product.unitType === "kg" ? `${product.unitValue} G` : `per ${product.unitValue} Unit`}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-stone-900 uppercase mb-2">Description</h3>
                        <p className="text-stone-600 leading-relaxed text-lg">
                            {product.productDescription || "No description provided for this item."}
                        </p>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-auto bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">


                        {/* Buttons */}
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0 || loading}
                                className={`col-span-1 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold
        hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center justify-center gap-2
        ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Processing...
                                    </>
                                ) : (
                                    "Order Now"
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {/* Reviews Section */}
            <div className="mb-10 mt-30">
                <h3 className="text-sm font-bold text-stone-900 uppercase mb-4">
                    Customer Reviews
                </h3>

                {/* Average Rating */}
                {reviews?.data?.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={
                                        i <
                                            Math.round(
                                                reviews.data.reduce((a, r) => a + r.rating, 0) /
                                                reviews.data.length
                                            )
                                            ? "text-amber-500 fill-amber-500"
                                            : "text-stone-300"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-sm text-stone-600">
                            ({reviews.data.length} reviews)
                        </span>
                    </div>
                )}

                {/* Reviews List */}
                {reviews?.data?.length === 0 ? (
                    <p className="text-stone-500">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews?.data?.map((review, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-stone-800">
                                        {review?.data?.userId?.name || "User"}
                                    </p>

                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={
                                                    i < review.rating
                                                        ? "text-amber-500 fill-amber-500"
                                                        : "text-stone-300"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-stone-600 text-sm">
                                    {review.comment || "No comment provided"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetails;