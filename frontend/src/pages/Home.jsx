import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";

// The homepage. Anyone can see this — no login needed.
// It shows a welcome banner plus a handful of products pulled straight
// from the database (the ones added by `npm run seed`, or later by an admin).
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // limit=8 -> just show the first 8 products on the homepage
    api("/products?limit=8")
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="hero">
        <h1>
          Modern essentials.
          <br />
          Made for everyday.
        </h1>
        <p>Simple, clean products — no login required to browse.</p>
        <Link className="btn btn-primary" to="/products">
          Shop the collection
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">Featured products</h2>

        {loading && <Message>Loading products...</Message>}
        {error && <Message type="error">{error}</Message>}
        {!loading && !error && products.length === 0 && (
          <Message>
            No products yet. An admin can add some from the Admin dashboard.
          </Message>
        )}

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
