import React from 'react';
import { Star, MapPin, Dessert } from 'lucide-react';
import { Link } from "react-router-dom"
const ShopCard = ({ shop }) => {
  console.log(shop);
  return (
      <Link to={`/home/shop/${shop.shop?._id}`} state={shop} className="block h-full">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-300 group cursor-pointer flex flex-col h-full">

          {/* Cover Image */}
          <div className="h-48 relative overflow-hidden bg-stone-100">
            <img
              src={shop.shop?.coverImage || "https://placehold.co/600x400/e5e7eb/a3a3a3?text=Bakery"}
              alt={shop.shop?.shopName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
              <Star size={12} className="text-amber-500 mr-1 fill-amber-500" />
              {shop.shop?.totalReviews}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="mb-2">
              <h3 className="font-bold text-lg text-stone-800 line-clamp-1 group-hover:text-amber-700 transition-colors">
                {shop.shop?.shopName}
              </h3>
              <p className="text-stone-500 text-xs flex items-center mt-1">
                <MapPin size={12} className="mr-1" /> {shop.shop?.city || "Local"}
              </p>
              <p className="text-stone-500 text-xs flex items-center mt-1">
                <Dessert size={12} className="mr-1" /> {shop.distanceInKm + "KM Away"}
              </p>
            </div>

            <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-grow">
              {shop.shop?.shopDescription || "Freshly baked goods made with love."}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-stone-50 mt-auto">
              <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                {shop.shop?.shopCategory || "Bakery"}
              </span>
              <span className="text-xs font-medium text-stone-400">View Shop →</span>
            </div>
          </div>
        </div>
      </Link>
  );
};

export default ShopCard;