import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all group">
      
      {/* IMAGE LINK */}
      <Link 
        to={`/home/product/${product._id}`} 
        state={product}  // <--- 🚨 THIS IS THE FIX 🚨
        className="block relative aspect-square overflow-hidden"
      >
        <img 
          src={product.images?.[0] || product.imageUrl || "https://placehold.co/400"} 
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4">
        {/* TITLE LINK */}
        <Link 
          to={`/home/product/${product._id}`} 
          state={product} // <--- ADD IT HERE TOO
          className="font-bold text-stone-800 hover:text-amber-600 transition-colors line-clamp-1"
        >
          {product.productName}
        </Link>

        {/* ... Rest of your card code (Price, Buttons, etc) ... */}
         <div className="flex items-center justify-between mt-3">
             <span className="font-bold text-amber-600">₹{product.price}</span>
             <button className="p-2 bg-stone-100 rounded-full hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors">
                 <ShoppingBag size={18} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default ProductCard;