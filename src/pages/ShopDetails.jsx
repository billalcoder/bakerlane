import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // <--- 1. Import Hook
import { Sparkles, ShoppingBag, ArrowLeft, Star, MapPin, Cake, X, CheckCircle } from "lucide-react";
import ProductCard from "../components/ProductCart";

// --- FETCH FUNCTIONS (Keep these outside the component) ---
const fetchShopDetails = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch shop");
    return data.shop || data.data;
};

const fetchShopProducts = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/product/get/${id}`);
    const data = await res.json();
    return data.products || data.data || [];
};

const ShopDetails = () => {
    const { id } = useParams();

    // --- 2. FETCH SHOP (With 5 Min Cache) ---
    const { data: shop, isLoading: shopLoading, isError } = useQuery({
        queryKey: ['shop', id],           // Unique ID for this specific shop
        queryFn: () => fetchShopDetails(id), // The function to run if no cache
        staleTime: 5 * 60 * 1000,         // 5 Minutes: Don't refetch if data is younger than this
        gcTime: 10 * 60 * 1000,           // 10 Minutes: Keep in memory before deleting
        refetchOnWindowFocus: false,      // Don't refetch just because I clicked the tab
    });
    console.log(shop);
    // --- 3. FETCH PRODUCTS (With 5 Min Cache) ---
    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ['shop_products', shop?.clientId?._id],
        queryFn: () => fetchShopProducts(shop?._id || id),
        // enabled: !!shop,                  // Only fetch products once Shop is loaded
        staleTime: 5 * 60 * 1000,         // 5 Minutes Cache
        refetchOnWindowFocus: false,
    });

    // --- LOCAL STATES (UI Only) ---
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customForm, setCustomForm] = useState({ weight: "", flavor: "", theme: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const flavors = ["🍫 Chocolate", "🍦 Vanilla", "🍓 Strawberry", "🍫 Choco Truffle", "🍍 Pineapple", "🍰 Red Velvet", "🍮 Butterscotch", "🍫 Black Forest", "🧁 Custom Flavour"];
    const themes = ["🎂 Birthday", "💍 Wedding", "🎉 Anniversary", "👶 Baby Shower", "🎮 Cartoon / Kids", "🌸 Floral", "🖤 Minimal", "📸 Photo Cake", "🧁 Other"];

    // --- HELPERS ---
    const categories = useMemo(() => {
        if (!products.length) return ["All"];
        const uniqueCats = new Set(products.map(p => p.category || "Others"));
        return ["All", ...Array.from(uniqueCats)];
    }, [products]);

    const filteredProducts = products.filter(p =>
        selectedCategory === "All" ? true : p.category === selectedCategory
    );

    // --- HANDLERS ---
    const handleCustomSubmit = async () => {
        if (!customForm.weight || !customForm.flavor || !customForm.theme) {
            alert("Please fill in all required fields.");
            return;
        }
        setIsSubmitting(true);
        // ... (Add your custom order logic here) ...
        alert("Custom order feature coming soon!"); // Placeholder
        setIsSubmitting(false);
        setIsCustomModalOpen(false);
    };

    // --- LOADING STATES ---
    if (shopLoading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading Shop Details...</div>;
    if (isError || !shop) return <div className="min-h-screen flex flex-col items-center justify-center gap-4">Shop not found.<Link to="/home" className="text-amber-600 underline">Go Home</Link></div>;

    return (
        <>
            <div className={`bg-stone-50 min-h-screen pb-20 animate-fade-in ${isCustomModalOpen ? 'blur-sm overflow-hidden h-screen' : ''}`}>
                {/* --- HERO SECTION --- */}
                <div className="relative h-72 w-full group overflow-hidden">
                    <img
                        src={shop.coverImage || "https://placehold.co/1200x400?text=Bakery"}
                        className="w-full h-full object-cover"
                        alt="Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
                        <Link to="/home" className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-4xl font-bold mb-2">{shop.shopName}</h1>
                        <p className="opacity-90 max-w-xl mb-3">{shop.shopDescription}</p>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1 text-amber-400">
                                <Star size={16} fill="currentColor" /> {shop.totalReviews || "New"}
                            </span>
                            <span className="flex items-center gap-1 opacity-80">
                                <MapPin size={16} /> {shop.city || "Local"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-12">
                    {/* --- PORTFOLIO --- */}
                    {shop.portfolio && shop.portfolio.filter(p => p.name).length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-6">Portfolio</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {shop.portfolio.filter(item => item.name).map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                                        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-sm text-stone-500">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- CUSTOM ORDER BANNER --- */}
                    <section className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                <Cake className="animate-bounce" /> Custom Cake Request
                            </h2>
                            <p className="opacity-90 text-sm md:text-base">
                                Need something special? Customize your flavor, theme, and design!
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCustomModalOpen(true)}
                            className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold shadow-md hover:bg-stone-100 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            Start Customizing <Sparkles size={16} />
                        </button>
                    </section>

                    {/* --- MENU SECTION --- */}
                    <section>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="text-amber-600" />
                                <h2 className="text-2xl font-bold text-stone-800">Menu</h2>
                            </div>
                            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
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

                        {productsLoading ? (
                            <div className="text-center py-10 text-stone-400">Loading Menu...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-400">
                                No products listed yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* --- CUSTOM MODAL --- */}
            {isCustomModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-white">
                            <h3 className="text-xl font-bold text-stone-800">Custom Order</h3>
                            <button onClick={() => setIsCustomModalOpen(false)}><X size={24} className="text-stone-500" /></button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Cake Weight</label>
                                <input type="text" className="w-full border border-stone-200 rounded-lg p-3" value={customForm.weight} onChange={(e) => setCustomForm({ ...customForm, weight: e.target.value })} placeholder="e.g. 1kg" />
                            </div>
                            {/* ... Add other inputs (Flavor, Theme, etc.) here same as before ... */}
                            <button onClick={handleCustomSubmit} disabled={isSubmitting} className="w-full bg-amber-600 text-white py-3.5 rounded-xl font-bold">{isSubmitting ? "Sending..." : "Confirm Request"}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopDetails;