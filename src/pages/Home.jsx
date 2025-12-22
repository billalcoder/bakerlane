import React, { useState, useEffect } from 'react';
import ShopCard from '../components/ShopCard';

const Home = () => {
    const [shops, setShops] = useState([]);

    // -----------------------------------------
    // 1️⃣ GET USER LOCATION + CALL BACKEND
    // -----------------------------------------
    const getShop = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("User Location:", latitude, longitude);

                try {
                    const res = await fetch(
                        `${import.meta.env.VITE_BASEURL}/shop/get?latitude=${latitude}&longitude=${longitude}`
                    );

                    const data = await res.json();
                    console.log("Shops from backend:", data);

                    if (data.success) {
                        setShops(data.shops);
                    }
                } catch (error) {
                    console.error("Error fetching shops:", error);
                }
            },
            (error) => {
                console.error("Location Error:", error);
            }
        );
    };

    useEffect(() => {
        getShop();
    }, []);

    // Mock data (optional – remove after backend works)
    useEffect(() => {
        setShops([
            { _id: 1, shopName: "Sweet Delights", city: "New York", rating: 4.8, shopCategory: "Cakes", coverImage: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" },
            { _id: 2, shopName: "The Crusty Loaf", city: "Brooklyn", rating: 4.5, shopCategory: "Bread", coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
        ]);
    }, []);

    return (
        <div className="py-8 animate-fade-in">
            <div className="text-center mb-10 px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
                    Fresh from the <span className="text-amber-600">Oven</span>
                </h1>
                <p className="text-stone-500 max-w-xl mx-auto">
                    Discover the best local home bakers and artisan shops near you.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-6">
                {shops.map(shop => (
                    <ShopCard key={shop._id} shop={shop} />
                ))}
            </div>
        </div>
    );
};

export default Home;
