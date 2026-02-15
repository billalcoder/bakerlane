import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
  <div className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all group">
  
  {/* IMAGE LINK */}
  <Link 
    to={`/home/product/${product._id}`} 
    state={product}
    className="block relative aspect-square overflow-hidden"
  >
    <img 
      src={product.images?.[0] || product.imageUrl || "https://placehold.co/400"} 
      alt={product.productName}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    
    {/* NEW: Review Badge */}
    {product.averageRating > 0 && (
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
        <Star size={12} className="fill-amber-500 text-amber-500" />
        <span className="text-[11px] font-bold text-stone-800">{product.averageRating}</span>
      </div>
    )}
  </Link>

  <div className="p-4">
    {/* CATEGORY & STOCK */}
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{product.category}</span>
      <span className={`text-[10px] font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        {product.stock > 0 ? '● In Stock' : 'Out of Stock'}
      </span>
    </div>

    {/* TITLE LINK */}
    <Link 
      to={`/home/product/${product._id}`} 
      state={product}
      className="block font-bold text-stone-800 hover:text-amber-600 transition-colors line-clamp-1 text-lg"
    >
      {product.productName}
    </Link>

    {/* PRICE & UNIT SECTION */}
    <div className="mt-3 flex flex-col">
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-amber-600/80 uppercase">Starting from</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-stone-900">₹{product.price}</span>
          <span className="text-stone-400 text-xs font-medium">
            /{product.unitType === "kg" ? `${product.unitValue}kg` : `pc`}
          </span>
        </div>

        {/* Action Button */}
        <button 
          className="p-2.5 bg-stone-900 rounded-xl hover:bg-amber-600 text-white transition-all duration-300 shadow-sm"
          title="Add to Cart"
        >
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
    
    {/* SUBTEXT: Why "Starting from" */}
    <p className="text-[15px] text-stone-400 mt-2 leading-tight italic">
      *Final price varies with custom flavors & themes.
    </p>
  </div>
</div>
  );
};

export default ProductCard;