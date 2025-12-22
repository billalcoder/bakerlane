import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowLeft, Star, MapPin } from "lucide-react";
import ProductCard from "../components/ProductCart"; // Ensure this path is correct

const ShopDetails = () => {
    const { id } = useParams();
    const { state } = useLocation();

    // --- 1. SHOP DATA STATE ---
    const [shop, setShop] = useState(state || null);
    // --- 2. PRODUCT DATA STATE ---
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // --- FETCH SHOP DATA (Your Existing Logic) ---
    useEffect(() => {
        if (!state) {
            fetch(`${import.meta.env.VITE_BASEURL}/shop/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setShop(data.shop || data.data);
                })
                .catch(err => console.error(err));
        }
    }, [id, state]);

    // --- FETCH PRODUCTS FOR THIS SHOP ---
    useEffect(() => {
        if (shop) {
            fetch(`${import.meta.env.VITE_BASEURL}/shop/product/get/${shop?.shop?._id}`)
                .then(res => res.json())
                .then(data => {
                    const allProducts = data.products || data.data || [];

                    // Filter: Check if product belongs to this shop
                    const shopProducts = allProducts.filter(p => {
                        // Handle if shopId is populated object or just string ID
                        const pShopId = typeof p.shopId === 'object' ? p.shopId._id : p.shopId;
                        return pShopId === shop._id || pShopId === id;
                    });

                    setProducts(shopProducts);
                })
                .catch(err => console.error("Error fetching products:", err));
        }
    }, [shop, id]);

    // --- LOGIC: EXTRACT UNIQUE CATEGORIES ---
    const categories = useMemo(() => {
        if (!products.length) return ["All"];
        // Create a Set to get unique values
        const uniqueCats = new Set(products.map(p => p.category || "Others"));
        return ["All", ...Array.from(uniqueCats)];
    }, [products]);

    // --- LOGIC: FILTER PRODUCTS ---
    const filteredProducts = products.filter(p =>
        selectedCategory === "All" ? true : p.category === selectedCategory
    );

    const handleAddToCart = (item) => {
        // Placeholder for your Cart Context logic
        alert(`Added ${item.productName || item.title} to cart`);
    };

    if (!shop) return <div className="p-10 text-center text-stone-500">Loading Shop Details...</div>;

    return (
        <div className="bg-stone-50 min-h-screen pb-20 animate-fade-in">

            {/* --- HERO SECTION (Cover Image & Shop Info) --- */}
            <div className="relative h-72 w-full group overflow-hidden">
                <img
                    src={shop?.shop?.coverImage || "https://placehold.co/1200x400?text=Bakery"}
                    className="w-full h-full object-cover"
                    alt="Cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
                    <Link to="http://localhost:5173/home" className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-4xl font-bold mb-2">{shop.shopName}</h1>
                    <p className="opacity-90 max-w-xl mb-3">{shop.shopDescription}</p>

                    <div className="flex items-center gap-4 text-sm font-medium">
                        {/* Rating (Mock or Real) */}
                        <span className="flex items-center gap-1 text-amber-400">
                            <Star size={16} fill="currentColor" /> {shop?.shop?.totalReviews}
                        </span>
                        {/* Location */}
                        <span className="flex items-center gap-1 opacity-80">
                            <MapPin size={16} /> {shop?.shop?.city || "Local"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-12">

                {/* --- 1. PORTFOLIO SECTION (Best Products) --- */}
                {shop.portfolio && shop.portfolio.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-amber-500" />
                            <h2 className="text-2xl font-bold text-stone-800">Chef's Specials</h2>
                        </div>
                        {/* Horizontal Scroll */}
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                            {shop.portfolio.map((item, index) => (
                                <div key={index} className="min-w-[220px]">
                                    {/* Reuse ProductCard, mapping portfolio fields to card props */}
                                    <ProductCard
                                        product={products}
                                        onAdd={handleAddToCart}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- 2. MENU SECTION (Categories + Product Grid) --- */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="text-amber-600" />
                            <h2 className="text-2xl font-bold text-stone-800">Menu</h2>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                                        : "bg-white text-stone-500 border border-stone-200 hover:border-amber-300 hover:text-amber-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-400">
                            No products listed yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAdd={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default ShopDetails;