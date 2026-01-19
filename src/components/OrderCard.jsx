import React, { useState } from 'react';
import { Package, Calendar, Store, Star, Cake, CheckCircle, Phone, MapPin } from 'lucide-react';

const OrderCard = ({ order }) => {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(order.reviewed || false);

  // 1. DETERMINE ORDER TYPE
  const isCustom = (!order.items || order.items.length === 0) && order.customization;
  const product = !isCustom ? order.items?.[0]?.productId : null;

  // 2. HELPER: Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 ring-yellow-200';
      case 'preparing': return 'bg-orange-50 text-orange-700 ring-orange-200';
      case 'on-the-way': return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'delivered': return 'bg-green-50 text-green-700 ring-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 ring-red-200';
      default: return 'bg-stone-50 text-stone-600 ring-stone-200';
    }
  };

  // 3. API: Submit Review
  const submitReview = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          productId: product?._id, 
          rating,
          comment
        })
      });

      const data = await res.json()
      if(!data.success){
        alert(data.message)
      }
      setReviewed(true);
      setShowReview(false);
    } catch (err) {
      console.log(err);
      alert("Could not submit review");
    } finally {
      setLoading(false);
    }
  };

  // Date Formatting
  const orderDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-5 shadow-sm hover:shadow-lg transition-all">

      {/* --- HEADER --- */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4">
          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Store size={20} />
          </div>
          <div>
            <h3 className="font-bold text-stone-800 text-base">
              {order.shopId?.shopName || 'Unknown Shop'}
            </h3>
            
            {/* Main Item Display */}
            <div className="flex gap-4 mt-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center flex-shrink-0">
                {isCustom ? (
                  <Cake className="text-amber-400 opacity-80" size={28} />
                ) : (
                  <img
                    src={product?.images?.[0] || "https://placehold.co/100"}
                    alt={product?.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-700 line-clamp-1">
                  {isCustom 
                    ? `Custom: ${order.customization?.theme || 'Cake'}` 
                    : product?.productName || 'Unknown Product'
                  }
                </p>
                <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                  <Calendar size={12} /> {orderDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-semibold rounded-full ring-1 uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="my-4 h-px bg-stone-100"></div>

      {/* --- CONTACT SECTION (Visible Only When Delivered) --- */}
      {order.orderStatus === 'delivered' && (
        <div className="mb-4 bg-green-50/50 rounded-xl p-3 border border-green-100 flex items-center justify-between">
            <div>
                <p className="text-[10px] uppercase text-green-600 font-bold tracking-wider mb-0.5">Baker Contact</p>
                <p className="text-sm font-bold text-stone-800 flex items-center gap-1">
                   <Store size={14} className="text-stone-400"/> {order.shopId?.shopName}
                </p>
            </div>
            
            {/* Phone Button */}
            {/* Note: Ensure your backend populates shopId.ownerId or shopId.phoneNumber */}
            <a 
                href={`tel:${order.shopId?.clientId?.phone || order.shopId?.phoneNumber}`} 
                className="flex items-center gap-2 bg-white text-green-700 px-3 py-2 rounded-lg text-xs font-bold border border-green-200 shadow-sm hover:bg-green-600 hover:text-white transition-colors"
            >
                <Phone size={14} />
                {order.shopId?.clientId?.phone || "Call Baker"}
            </a>
        </div>
      )}

      {/* --- PRICE & DETAILS --- */}
      <div className="flex justify-between items-end">
        <div className="text-sm text-stone-600">
          {isCustom ? (
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs border border-amber-100">
                {order.customization?.flavor}
              </span>
              <span className="bg-stone-50 text-stone-600 px-2 py-0.5 rounded text-xs border border-stone-100">
                {order.customization?.weight}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Package size={16} className="text-stone-400" />
              <span className="text-xs text-stone-500">{product?.unitValue || '1'} {product?.unitType || 'Unit'}</span>
            </div>
          )}
        </div>

        <div className="text-right">
            <p className="text-xs uppercase text-stone-400 font-semibold">Total</p>
            <div className="text-xl font-extrabold text-amber-600">
                {order.totalAmount ? `₹${order.totalAmount}` : 'Quote Pending'}
            </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (Review) --- */}
      {order.orderStatus === 'delivered' && !reviewed && (
        <button
          onClick={() => setShowReview(!showReview)}
          className="mt-4 w-full py-2 text-sm font-semibold text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-stone-200"
        >
          <Star size={16} /> Rate & Review
        </button>
      )}

      {reviewed && (
        <p className="mt-4 text-center text-xs font-bold text-green-600 flex items-center justify-center gap-1 bg-green-50 py-2 rounded-lg">
          <CheckCircle size={14} /> Review Submitted
        </p>
      )}

      {/* --- REVIEW FORM --- */}
      {showReview && (
        <div className="mt-3 rounded-xl bg-stone-50 p-4 border border-stone-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={28}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition-transform hover:scale-110 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-stone-200 fill-stone-100'}`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the taste? (Optional)"
            className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            rows="2"
          />
          <button
            onClick={submitReview}
            disabled={loading}
            className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;