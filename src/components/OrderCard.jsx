import React, { useState } from 'react';
import { Package, Calendar, Store, Star } from 'lucide-react';

const OrderCard = ({ order }) => {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(order.reviewed || false);

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

  const product = order.items[0]?.productId;

  const submitReview = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          productId: product,
          rating,
          comment
        })
      });

      if (!res.ok) throw new Error("Review failed");

      setReviewed(true);
      setShowReview(false);
    } catch (err) {
      alert("Could not submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-5 shadow-sm hover:shadow-lg transition-all">

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Store size={20} />
          </div>
         <div>
  <h3 className="font-bold text-stone-800 text-base">
    {order.shopId?.shopName || 'Unknown Shop'}
  </h3>

  {/* Product Image */}
  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
    <img
      src={order.items[0].productId?.images[0]}
      alt={order.items[0].productId?.productName}
      className="w-full h-full object-cover"
    />
  </div>

  <p className="mt-2 text-sm text-stone-600 font-medium">
    {order.items[0].productId?.productName || 'Unknown Product'}
  </p>

  <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
    <Calendar size={12} />
    {new Date(order.createdAt).toLocaleDateString()} •{' '}
    {new Date(order.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}
  </p>
</div>
        </div>

        <span className={`px-3 py-1 text-xs font-semibold rounded-full ring-1 ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>

      {/* Body */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-stone-400" />
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {order.items[0].productId?.unitType} • {order.items[0].productId?.unitValue}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-stone-400 font-semibold">Total</p>
          <p className="text-2xl font-extrabold text-amber-600">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Review CTA */}
      {order.orderStatus === 'delivered' && !reviewed && (
        <button
          onClick={() => setShowReview(!showReview)}
          className="mt-5 text-sm font-semibold text-amber-600 hover:underline"
        >
          ⭐ Leave a review
        </button>
      )}

      {reviewed && (
        <p className="mt-5 text-sm font-semibold text-green-600">✔ Review submitted</p>
      )}

      {/* Review Box */}
      {showReview && (
        <div className="mt-5 rounded-xl bg-stone-50 p-4">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={22}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <button
            onClick={submitReview}
            disabled={loading}
            className="mt-3 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;