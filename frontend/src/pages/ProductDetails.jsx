import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api";
import { useCart } from "../context/CartContext";
import Message from "../components/Message";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api(`/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Message>Loading product...</Message>;
  if (error) return <Message type="error">{error}</Message>;
  if (!product) return <Message>Product not found.</Message>;

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="detail">
      <img className="detail-image" src={product.image} alt={product.name} />

      <div className="detail-info">
        <span className="card-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="detail-price">₹{product.price}</p>
        <p>{product.description}</p>
        <p className="detail-stock">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <button className="btn btn-primary" disabled={!product.stock} onClick={handleAdd}>
          {added ? "Added!" : "Add to cart"}
        </button>
      </div>
    </main>
  );
}
