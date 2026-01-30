import React from 'react';
import { Star, MapPin, Dessert } from 'lucide-react';
import { Link } from "react-router-dom";

const ShopCard = ({ shop }) => {
  console.log(shop)
  return (
    <Link to={`/home/shop/${shop.shop?._id}`} state={shop} className="block h-full">
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-300 group flex flex-col h-full">

        {/* Cover Image */}
        <div className="h-48 relative overflow-hidden bg-stone-100">
          {console.log(shop.shop?.coverImage)}
          <img
            src={shop.shop?.profileImage || "https://placehold.co/600x400"}
            alt={shop.shop?.shopName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
            <Star size={12} className="text-amber-500 mr-1 fill-amber-500" />
            {shop.shop?.totalReviews || 0}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-stone-800">
            {shop.shop?.shopName}
          </h3>

          <p className="text-stone-500 text-xs flex items-center mt-1">
            <MapPin size={12} className="mr-1" />
            {shop.shop?.city || "Local"}
          </p>

          {/* 📍 Distance only if available */}
          {shop.distanceInKm !== null && (
            <p className="text-stone-500 text-xs flex items-center mt-1">
              <Dessert size={12} className="mr-1" />
              {shop.distanceInKm} KM Away
            </p>
          )}

          <p className="text-stone-500 text-sm line-clamp-2 mb-4 mt-2">
            {shop.shop?.shopDescription || "Freshly baked goods made with love."}
          </p>

          <div className="flex items-center justify-between pt-3 border-t mt-auto">
            <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-md">
              {shop.shop?.shopCategory || "Bakery"}
            </span>
            <span className="text-xs text-stone-400">View Shop →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
