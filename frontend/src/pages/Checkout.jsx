import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";

export default function Checkout() {
  // Cart data (items + total) comes from CartContext.
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // One useState for each form field. Simple and easy to follow.
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  const [placing, setPlacing] = useState(false); // true while the order is being sent
  const [error, setError] = useState("");

  async function handlePlaceOrder(e) {
    e.preventDefault(); // stop the page from refreshing on submit
    setError("");

    // Must be logged in to place an order.
    if (!user) {
      navigate("/login");
      return;
    }

    setPlacing(true);

    // Put the shipping fields into one simple object to send.
    const shippingAddress = {
      name: fullName,
      address: address,
      city: city,
      postalCode: postalCode,
      phone: phone,
    };

    try {
      // Send the cart items + shipping details to the backend.
      const data = await api("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress }),
      });

      clear(); // empty the cart now that the order is placed
      navigate("/order-success", { state: { orderId: data.order._id } });
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  }

  // If the cart is empty, there's nothing to check out.
  if (items.length === 0) {
    return (
      <main>
        <h1>Checkout</h1>
        <Message>Your cart is empty.</Message>
      </main>
    );
  }

  return (
    <main>
      <h1>Checkout</h1>

      <div className="checkout-page">
        {/* Shipping form */}
        <form onSubmit={handlePlaceOrder} className="auth-form">
          <h2>Shipping Details</h2>

          <Message type="error">{error}</Message>

          <label>
            Full Name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>

          <label>
            Address
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>

          <label>
            City
            <input value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>

          <label>
            Postal Code
            <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
          </label>

          <label>
            Phone Number
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.product}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
