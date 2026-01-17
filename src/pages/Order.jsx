import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';

// 1. Removed "export" from here
const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    console.log(orders);
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
                console.log(data);
                // robust check for data structure
                const orderList = data?.data || (Array.isArray(data.data) ? data : []);
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
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 m-6">
            {error}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">My Orders</h1>
                    <p className="text-stone-500 text-sm">Track your past purchases</p>
                </div>
            </div>

            {/* List */}
            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-sm">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-stone-200" />
                    <h3 className="text-lg font-bold text-stone-600">No orders yet</h3>
                    <p className="text-stone-400 text-sm mb-6">Looks like you haven't ordered anything yet.</p>
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

// 2. Added default export here
export default Order;