import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowLeft, Star, MapPin, Cake, X, CheckCircle } from "lucide-react";
import ProductCard from "../components/ProductCart";
// import { useShop } from "../../context/ShopContext";

const ShopDetails = () => {
    const { id } = useParams();
    const { state } = useLocation();

    // --- STATES ---
    const [shop, setShop] = useState(state || null);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [user, setUser] = useState("")
    // --- MODAL STATES ---
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customForm, setCustomForm] = useState({
        weight: "",
        flavor: "",
        theme: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // --- DATA LISTS ---
    const flavors = ["🍫 Chocolate", "🍦 Vanilla", "🍓 Strawberry", "🍫 Choco Truffle", "🍍 Pineapple", "🍰 Red Velvet", "🍮 Butterscotch", "🍫 Black Forest", "🧁 Custom Flavour"];
    const themes = ["🎂 Birthday", "💍 Wedding", "🎉 Anniversary", "👶 Baby Shower", "🎮 Cartoon / Kids", "🌸 Floral", "🖤 Minimal", "📸 Photo Cake", "🧁 Other"];
    console.log(products);
    // --- FETCH SHOP DATA ---
    useEffect(() => {
        // Helper to fetch Shop
        const fetchShopDetails = async () => {
            if (!state) { // Only fetch if we didn't pass data via router state
                try {
                    const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/${id}`);
                    const data = await res.json();
                    if (data.success) setShop(data.shop || data.data);
                } catch (err) { console.error(err); }
            }
        };

        // Helper to fetch Products (Uses 'id' directly from params, not 'shop' state)
        const fetchProducts = async () => {
            try {
                // NOTE: Ensure your backend accepts the shop ID from the URL param here
                const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/product/get/${id}`);
                const data = await res.json();
                setProducts(data.products || data.data || []);
            } catch (err) { console.error("Error fetching products:", err); }
        };

        // Execute BOTH in parallel
        Promise.all([fetchShopDetails(), fetchProducts()]);

    }, [id, state]);

    useEffect(() => {

        fetch(`${import.meta.env.VITE_BASEURL}/auth/profile`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success) setUser(data.shop || data.data);
            })
            .catch(err => console.error(err));
    }, []);

    // --- FETCH PRODUCTS ---
    useEffect(() => {
        if (shop) {
            fetch(`${import.meta.env.VITE_BASEURL}/shop/product/get/${shop?.shop?._id || shop._id}`)
                .then(res => res.json())
                .then(data => {
                    const allProducts = data.products || data.data || [];
                    setProducts(allProducts);
                })
                .catch(err => console.error("Error fetching products:", err));
        }
    }, [shop]);

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
    const handleAddToCart = (item) => {
        alert(`Added ${item.name} to cart`);
    };

    const handleCustomSubmit = async () => {
        if (!customForm.weight || !customForm.flavor || !customForm.theme) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        // Ensure you have the user ID from your context/auth system
        const orderPayload = {
            userId: user?._id, // REPLACE with real user ID
            shopId: shop?.shop._id,
            items: [],
            totalAmount: 0,
            paymentStatus: "pending",
            customization: customForm
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BASEURL}/order/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Custom order request sent successfully!");
                setIsCustomModalOpen(false);
                setCustomForm({ weight: "", flavor: "", theme: "", notes: "" });
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!shop) return <div className="p-10 text-center text-stone-500">Loading Shop Details...</div>;

    // We use a Fragment (<>...</>) so the Modal can be outside the main div
    return (
        <>
            {/* MAIN CONTENT */}
            <div className={`bg-stone-50 min-h-screen pb-20 animate-fade-in ${isCustomModalOpen ? 'blur-sm overflow-hidden h-screen' : ''}`}>

                {/* --- HERO SECTION --- */}
                <div className="relative h-72 w-full group overflow-hidden">
                    <img
                        src={shop?.shop?.coverImage || shop.coverImage || "https://placehold.co/1200x400?text=Bakery"}
                        className="w-full h-full object-cover"
                        loading="lazy"
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
                                <Star size={16} fill="currentColor" /> {shop?.shop?.totalReviews || "New"}
                            </span>
                            <span className="flex items-center gap-1 opacity-80">
                                <MapPin size={16} /> {shop?.shop?.city || "Local"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-12">

                    {/* --- 1. PORTFOLIO SECTION --- */}
                    {shop.portfolio && shop.portfolio.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-amber-500" />
                                <h2 className="text-2xl font-bold text-stone-800">Chef's Specials</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                                {shop.portfolio.map((item, index) => (
                                    <div key={index} className="w-full h-full">
                                        <ProductCard
                                            product={item}
                                            image={item.image}
                                            name={item.name}
                                            category={item.category}
                                            price={item.price}
                                            onAdd={handleAddToCart}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 2. CUSTOMIZATION BANNER --- */}
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

                    {/* --- 3. MENU SECTION --- */}
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

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-400">
                                No products listed yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} onAdd={handleAddToCart} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* --- CUSTOM ORDER MODAL (OUTSIDE MAIN DIV) --- */}
            {/* Using fixed inset-0 z-[9999] ensures it sits on top of everything */}
            {isCustomModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">

                    {/* The Modal Box - animate-in zoom-in-95 makes it "Pop" */}
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                    <Cake className="text-amber-500" /> Custom Order
                                </h3>
                                <p className="text-xs text-stone-500">Tell us how you want your cake!</p>
                                <p className="text-xs text-stone-500">Once the baker accepts your request, you will receive their contact number and can connect with them</p>
                            </div>
                            <button
                                onClick={() => setIsCustomModalOpen(false)}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-stone-500" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Cake Weight</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1kg, 2.5kg"
                                    className="w-full border border-stone-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                                    value={customForm.weight}
                                    onChange={(e) => setCustomForm({ ...customForm, weight: e.target.value })}
                                />
                            </div>

                            {/* Flavor */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Select Flavour</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {flavors.map(flav => (
                                        <button
                                            key={flav}
                                            onClick={() => setCustomForm({ ...customForm, flavor: flav })}
                                            className={`text-xs p-3 rounded-lg border text-left transition-all ${customForm.flavor === flav
                                                ? "border-amber-500 bg-amber-50 text-amber-700 font-bold ring-2 ring-amber-500/20"
                                                : "border-stone-200 text-stone-600 hover:bg-stone-50"
                                                }`}
                                        >
                                            {flav}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Select Theme</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {themes.map(thm => (
                                        <button
                                            key={thm}
                                            onClick={() => setCustomForm({ ...customForm, theme: thm })}
                                            className={`text-xs p-3 rounded-lg border text-left transition-all ${customForm.theme === thm
                                                ? "border-amber-500 bg-amber-50 text-amber-700 font-bold ring-2 ring-amber-500/20"
                                                : "border-stone-200 text-stone-600 hover:bg-stone-50"
                                                }`}
                                        >
                                            {thm}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">Additional Notes</label>
                                <textarea
                                    rows="3"
                                    placeholder="Message on cake, color preferences, etc."
                                    className="w-full border border-stone-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                    value={customForm.notes}
                                    onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-stone-100 bg-white">
                            <button
                                onClick={handleCustomSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-amber-600 text-white py-3.5 rounded-xl font-bold hover:bg-amber-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-amber-200"
                            >
                                {isSubmitting ? "Sending Request..." : "Confirm Custom Order"}
                                {!isSubmitting && <CheckCircle size={20} />}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ShopDetails;