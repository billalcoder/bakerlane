import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAdd }) => {
    const { singleproduct, setSingleProduct } = useState(null)
    console.log(singleproduct);

    async function getProductId() {
        const Id = await fetch(`${import.meta.env.VITE_BASEURL}/shop/product/${product._id}`)
        const data = await Id.json()
        setSingleProduct(data)
    }
    useEffect(() => {
        getProductId()
    }, [singleproduct])
    // Handle case where product might be a portfolio item with slightly different fields
    const image = product?.images?.[0] || product?.imageUrl || "https://placehold.co/300";
    const name = product?.productName || product?.title || "Unnamed Product";
    const price = product?.price || 0;
    const category = product?.category || "Special";

    return (
        <Link to={`/home/product/${product._id}`} state={singleproduct}>
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
                {/* Image Area */}
                <div className="h-40 bg-stone-100 relative overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-stone-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {category}
                    </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-stone-800 line-clamp-1 mb-1">{name}</h3>
                    <p className="text-stone-500 text-xs line-clamp-2 mb-3 flex-grow">
                        {product?.productDescription || "Freshly baked goodness."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-50">
                        <span className="font-extrabold text-stone-800">₹{price}</span>
                        <button
                            onClick={() => onAdd && onAdd(product)}
                            className="bg-amber-100 text-amber-700 p-2 rounded-full hover:bg-amber-600 hover:text-white transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;