import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false); // Changed to false initially to avoid double-loading
    const [locationDenied, setLocationDenied] = useState(false);
    
    // Track current page, total pages, and coordinates for subsequent fetches
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [coords, setCoords] = useState({ lat: null, lng: null });

    const fetchShops = useCallback(async (lat, lng, page = 1) => {
        try {
            setLoading(true);
            const baseUrl = `${import.meta.env.VITE_BASEURL}/shop/get`;
            
            // Build query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "1"
            });

            if (lat && lng) {
                params.append("latitude", lat);
                params.append("longitude", lng);
            }

            const res = await fetch(`${baseUrl}?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                // IMPORTANT: Append data if page > 1, otherwise replace (for fresh load)
                setShops(prev => page === 1 ? data.shops : [...prev, ...data.shops]);
                
                // Update pagination state with data from backend
                if (data.pagination) {
                    setPagination({
                        page: data.pagination.page,
                        totalPages: data.pagination.totalPages
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching shops:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const initializeShops = useCallback(() => {
        // Reset state for a fresh fetch
        setShops([]);
        setPagination({ page: 1, totalPages: 1 });

        if (!navigator.geolocation) {
            setLocationDenied(true);
            fetchShops(null, null, 1);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords({ lat: latitude, lng: longitude });
                fetchShops(latitude, longitude, 1);
            },
            () => {
                setLocationDenied(true);
                fetchShops(null, null, 1); 
            }
        );
    }, [fetchShops]);

    // This is the trigger for your infinite scroll or "Load More" action
    const loadMore = useCallback(() => {
        // Only fetch if we aren't already loading and there are more pages
        if (!loading && pagination.page < pagination.totalPages) {
            const nextPage = pagination.page + 1;
            fetchShops(coords.lat, coords.lng, nextPage);
        }
    }, [loading, pagination, coords, fetchShops]);

    useEffect(() => {
        initializeShops();
    }, [initializeShops]);

    return (
        <ShopContext.Provider value={{ 
            shops, 
            loading, 
            locationDenied, 
            pagination,
            loadMore, // Expose this so Home.jsx can call it
            refetch: initializeShops 
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);