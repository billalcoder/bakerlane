import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAdd }) => {
    const [singleproduct, setSingleProduct] = useState(null)
    console.log(singleproduct);

    async function getProductId() {
        const Id = await fetch(`${import.meta.env.VITE_BASEURL}/shop/product/${product._id}`)
        const data = await Id.json()
        console.log(data);
        setSingleProduct(data.product)
    }
    useEffect(() => {
        getProductId()
    }, [])
    // Handle case where product might be a portfolio item with slightly different fields
    const image = product?.images?.[0] || product?.imageUrl || "https://placehold.co/300";
    const name = product?.productName || product?.title || "Unnamed Product";
    const price = product?.price || 0;
    const category = product?.category || "Special";

return (
        <Link 
            to={`/home/product/${product._id}`} 
            state={singleproduct}
            className="block h-full" // Ensures the link takes full height of the grid cell
        >
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">
                
                {/* --- Image Area --- */}
                <div className="h-48 sm:h-40 bg-stone-50 relative overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-stone-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {category}
                    </span>

                    {/* Best Product Badge (Optional visual improvement) */}
                    {product.isBestProduct && (
                        <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* --- Details Area --- */}
                <div className="p-4 flex flex-col flex-grow">
                    
                    {/* Title */}
                    <h3 className="font-bold text-stone-800 text-sm sm:text-base line-clamp-1 mb-1">
                        {name}
                    </h3>

                    {/* Description - specific height limits for alignment */}
                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-2 min-h-[2.5em]">
                        {product?.productDescription || "Freshly baked goodness made with care."}
                    </p>

                    {/* Unit Info */}
                    <div className="text-stone-400 text-[10px] font-medium uppercase tracking-wide mb-4">
                        {product?.unitValue ? `${product.unitValue} ${product?.unitType || 'unit'}` : 'Standard Pack'}
                    </div>

                    {/* --- Footer (Price & Action) --- */}
                    {/* 'mt-auto' forces this section to the bottom */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-stone-400 font-medium">Price</span>
                            <span className="font-extrabold text-stone-800 text-lg">₹{price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;