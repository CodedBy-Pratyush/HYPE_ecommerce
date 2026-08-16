import { useState, useEffect } from "react";

const emptyForm = { name: "", description: "", price: "", category: "", stock: "" };

// A single form used for BOTH "add a new product" and "edit a product".
// The parent (Admin page) tells us which mode we're in via `editingProduct`.
export default function ProductForm({ editingProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);

  // When the admin clicks "Edit" on a product, fill the form with its data.
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        stock: editingProduct.stock,
      });
    } else {
      setForm(emptyForm);
    }
    setFile(null);
  }, [editingProduct]);

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // We use FormData (not plain JSON) because we may be sending an image file.
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("image", file);

    onSubmit(formData);
    setForm(emptyForm);
    setFile(null);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{editingProduct ? "Edit product" : "Add a new product"}</h3>

      <label>
        Name
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </label>

      <div className="form-row">
        <label>
          Price (₹)
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        Category
        <input
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          required
        />
      </label>

      <label>
        Product image {editingProduct ? "(leave empty to keep the current one)" : ""}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required={!editingProduct}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingProduct ? "Save changes" : "Add product"}
        </button>

        {editingProduct && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
