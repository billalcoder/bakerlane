export const ReviewForm = ({ orderId, productId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    await fetch(`${import.meta.env.VITE_BASEURL}/review`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, productId, rating, comment })
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="p-4 border rounded-xl mt-3">
      <select
        value={rating}
        onChange={e => setRating(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        {[5,4,3,2,1].map(r => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-amber-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
};
