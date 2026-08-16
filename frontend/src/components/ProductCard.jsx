import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// One product tile shown on the Home and Shop pages.
export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <article className="card">
      <Link to={`/products/${product._id}`} className="card-link">
        <img className="card-image" src={product.image} alt={product.name} />
        <div className="card-body">
          <span className="card-category">{product.category}</span>
          <h3 className="card-title">{product.name}</h3>
          <p className="card-price">₹{product.price}</p>
        </div>
      </Link>

      <button
        className="btn btn-primary btn-block"
        disabled={!product.stock}
        onClick={() => add(product)}
      >
        {product.stock ? "Add to cart" : "Out of stock"}
      </button>
    </article>
  );
}
