import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  // Checkout.jsx sends the new order's id along when it navigates here.
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <main style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>Order Placed! 🎉</h1>
      <p>Thanks for your purchase — your order is being processed.</p>

      {/* Only show the order id if we actually got one */}
      {orderId && <p>Order ID: {orderId}</p>}

      <Link to="/products" className="btn btn-primary">
        Back to shopping
      </Link>
    </main>
  );
}
