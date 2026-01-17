import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locationDenied, setLocationDenied] = useState(false);

    const fetchShops = async (lat, lng) => {
        try {
            setLoading(true); // Ensure loading is true when we start
            const url = lat && lng
                ? `${import.meta.env.VITE_BASEURL}/shop/get?latitude=${lat}&longitude=${lng}`
                : `${import.meta.env.VITE_BASEURL}/shop/get`;

            const res = await fetch(url);
            const data = await res.json();
            
            if (data.success) {
                setShops(data.shops);
            }
        } catch (err) {
            console.error("Error fetching shops:", err);
        } finally {
            setLoading(false);
        }
    };

    const initializeShops = () => {
        // If we already have shops, don't load again!
        if (shops.length > 0) {
            setLoading(false);
            return;
        }

        if (!navigator.geolocation) {
            setLocationDenied(true);
            fetchShops();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchShops(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                setLocationDenied(true);
                fetchShops(); // fallback to no-location fetch
            }
        );
    };

    useEffect(() => {
        initializeShops();
    }, []);

    return (
        <ShopContext.Provider value={{ shops, loading, locationDenied, refetch: initializeShops }}>
            {children}
        </ShopContext.Provider>
    );
};

// Custom hook to use the context easily
export const useShop = () => useContext(ShopContext);