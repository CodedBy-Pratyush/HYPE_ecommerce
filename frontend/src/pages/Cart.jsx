import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";

export default function Cart() {
  const { items, remove, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Send the shopper to the Checkout page (where they fill in shipping details).
  function goToCheckout() {
    // Must be logged in to place an order.
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <main>
        <h1>Your cart</h1>
        <Message>Your cart is empty.</Message>
      </main>
    );
  }

  return (
    <main>
      <h1>Your cart</h1>

      {items.map((item) => (
        <div className="cart-row" key={item.product}>
          <img src={item.image} alt={item.name} />
          <div className="cart-row-info">
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.product, Number(e.target.value))}
          />
          <button className="btn btn-secondary" onClick={() => remove(item.product)}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h2>Total: ₹{total}</h2>
        <button className="btn btn-primary" onClick={goToCheckout}>
          Checkout
        </button>
      </div>
    </main>
  );
}
