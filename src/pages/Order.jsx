import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/me`, {
                    credentials: "include"
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await res.json();
                
                // ✅ CLEANER FIX: Explicitly check if data.data is an array
                // If the API returns { success: true, data: [...] }, this works perfectly.
                const orderList = Array.isArray(data?.data) ? data.data : [];
                
                setOrders(orderList);

            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Could not load your orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mb-2 text-amber-600" size={32} />
            <p>Loading your cravings...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 m-6 flex flex-col items-center">
            <p className="mb-4">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="text-sm underline text-stone-500 hover:text-stone-800"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-amber-100 rounded-full text-amber-600 shadow-sm">
                    <ShoppingBag size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">My Orders</h1>
                    <p className="text-stone-500 text-sm">Track your past purchases</p>
                </div>
            </div>

            {/* List */}
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center">
                    <div className="bg-stone-50 p-4 rounded-full mb-4">
                        <ShoppingBag size={32} className="text-stone-300" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-600">No orders yet</h3>
                    <p className="text-stone-400 text-sm max-w-xs mx-auto mb-6">
                        Looks like you haven't ordered anything yet. Start exploring our menu!
                    </p>
                    <button 
                        onClick={() => navigate('/home')}
                        className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 transition-colors"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order;