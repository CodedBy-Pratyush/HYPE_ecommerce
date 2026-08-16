import { useEffect, useState } from "react";

import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";
import Message from "../components/Message";

// The Admin dashboard. Only visible to a logged-in user with role "admin".
// It lets the admin: view all products, add a new one, edit one, delete one,
// and view/update customer orders.
export default function Admin() {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    setError("");

    Promise.all([
      api("/products?limit=100"),
      api("/orders/admin/all"),
    ])
      .then(([productData, orderData]) => {
        setProducts(productData.products);
        setOrders(orderData.orders);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  // Only load admin data once we know the user is actually an admin.
  useEffect(() => {
    if (user?.role === "admin") loadData();
  }, [user]);

  // Still checking login status -> avoid a flash of the 403 message.
  if (authLoading) return <Message>Checking your login...</Message>;

  // Not an admin -> block access.
  if (!user || user.role !== "admin") {
    return (
      <main>
        <h1>403 — Admins only</h1>
        <p>You need to be logged in as an admin to see this page.</p>
      </main>
    );
  }

  async function handleSaveProduct(formData) {
    try {
      if (editingProduct) {
        await api(`/products/${editingProduct._id}`, { method: "PUT", body: formData });
      } else {
        await api("/products", { method: "POST", body: formData });
      }
      setEditingProduct(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    try {
      await api(`/orders/admin/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <Message type="error">{error}</Message>

      <section className="section">
        <ProductForm
          editingProduct={editingProduct}
          onSubmit={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Products ({products.length})</h2>

        {loading && <Message>Loading...</Message>}

        {!loading &&
          products.map((product) => (
            <div className="admin-row" key={product._id}>
              <img src={product.image} alt={product.name} />
              <span className="admin-row-info">
                {product.name} — ₹{product.price} — {product.stock} in stock
              </span>
              <button className="btn btn-secondary" onClick={() => setEditingProduct(product)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(product._id)}>
                Delete
              </button>
            </div>
          ))}
      </section>

      <section className="section">
        <h2 className="section-title">Orders ({orders.length})</h2>

        {!loading && orders.length === 0 && <Message>No orders yet.</Message>}

        {orders.map((order) => (
          <div className="order-row" key={order._id}>
            <div>
              <b>{order._id}</b>
              <p>
                {order.user?.email} — ₹{order.total}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </section>
    </main>
  );
}
