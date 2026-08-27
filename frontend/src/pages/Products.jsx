import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductForm from "../components/ProductForm";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          formData
        );
      } else {
        await api.post("/products", formData);
      }

      setShowForm(false);
      setEditingProduct(null);

      await loadProducts();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to save product");
      }
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      await loadProducts();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to delete product");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  };

  return (
    <>
      <Header
        eyebrow="MANAGEMENT"
        title="Products"
        subtitle="Manage products in your supply chain"
        onRefresh={loadProducts}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="page-actions">
        <button className="primary-btn" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">PRODUCT LIST</p>
            <h2>All Products</h2>
          </div>

          <span className="count-badge">
            {products.length} products
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            No products found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <span className="code">
                        {product.productCode}
                      </span>
                    </td>

                    <td>{product.name}</td>

                    <td>
                      {product.description || "-"}
                    </td>

                    <td>
                      {formatCurrency(product.price)}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;