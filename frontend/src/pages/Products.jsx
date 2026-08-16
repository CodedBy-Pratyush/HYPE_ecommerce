import { useEffect, useState } from "react";

import { api } from "../api";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";

// The full shop page: search, filter by category, sort, and paginate.
export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load the list of categories once, for the dropdown.
  useEffect(() => {
    api("/products/categories")
      .then((data) => setCategories(data.categories))
      .catch(() => {}); // not critical if this fails
  }, []);

  // Re-fetch products whenever a filter changes.
  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      search,
      category,
      sort,
      page,
      limit: 8,
    });

    api(`/products?${params.toString()}`)
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1); // always go back to page 1 when a filter changes
  }

  return (
    <main>
      <h1>Shop</h1>

      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => updateFilter(setSearch, e.target.value)}
        />

        <select value={category} onChange={(e) => updateFilter(setCategory, e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => updateFilter(setSort, e.target.value)}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {loading && <Message>Loading products...</Message>}
      {error && <Message type="error">{error}</Message>}
      {!loading && !error && products.length === 0 && (
        <Message>No products match your search.</Message>
      )}

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
