import { useEffect, useState } from "react";

function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    productCode: "",
    name: "",
    description: "",
    price: ""
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productCode: product.productCode || "",
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? ""
      });
    } else {
      setFormData({
        productCode: "",
        name: "",
        description: "",
        price: ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Code</label>
        <input
          type="text"
          name="productCode"
          value={formData.productCode}
          onChange={handleChange}
          placeholder="Enter product code (e.g., P002)"
          required
        />
      </div>

      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price (e.g., 49999.00)"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {product ? "Update Product" : "Add Product"}
        </button>

        {product && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;