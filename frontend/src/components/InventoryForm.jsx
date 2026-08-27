import { useEffect, useState } from "react";

function InventoryForm({
  inventory,
  products,
  warehouses,
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: ""
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        productId: inventory.product?.id || "",
        warehouseId: inventory.warehouse?.id || "",
        quantity: inventory.quantity ?? ""
      });
    } else {
      setFormData({
        productId: "",
        warehouseId: "",
        quantity: ""
      });
    }
  }, [inventory]);

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
      productId: Number(formData.productId),
      warehouseId: Number(formData.warehouseId),
      quantity: Number(formData.quantity)
    });
  };

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product</label>

        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
          disabled={!!inventory}
        >
          <option value="">Select Product</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.productCode} - {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Warehouse</label>

        <select
          name="warehouseId"
          value={formData.warehouseId}
          onChange={handleChange}
          required
          disabled={!!inventory}
        >
          <option value="">Select Warehouse</option>

          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.warehouseCode} - {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {inventory ? "Update Inventory" : "Add Inventory"}
        </button>

        {inventory && (
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

export default InventoryForm;