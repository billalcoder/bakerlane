import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);

    const initializeUser = async () => {
        try {
            const user = await fetch(`${import.meta.env.VITE_BASEURL}/auth/profile`)
            const userData = await user.json()
            if (userData.error || !userData.success) {
                return alert(userData.error || !userData.data)
            }
            setUser(userData)
        } catch (error) {
            console.log(error);
            alert("something went wrong")
        }
    };

    useEffect(() => {
        initializeUser();
    }, []);

    return (
        <ShopContext.Provider value={{ user }}>
            {children}
        </ShopContext.Provider>
    );
};

// Custom hook to use the context easily
export const useUser = () => useContext(ShopContext);