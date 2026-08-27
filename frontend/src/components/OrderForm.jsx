import { useState } from "react";

function OrderForm({ products, warehouses, inventory, onSubmit }) {
  const [formData, setFormData] = useState({
    orderNumber: "",
    productId: "",
    warehouseId: "",
    quantity: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "productId" ? { warehouseId: "", quantity: "" } : {})
    }));
  };

  const availableInventory = inventory.filter(
    (item) =>
      String(item.product?.id) === String(formData.productId) &&
      item.quantity > 0
  );

  const availableWarehouseIds = availableInventory.map(
    (item) => item.warehouse?.id
  );

  const availableWarehouses = warehouses.filter((warehouse) =>
    availableWarehouseIds.includes(warehouse.id)
  );

  const selectedInventory = availableInventory.find(
    (item) =>
      String(item.warehouse?.id) === String(formData.warehouseId)
  );

  const availableQuantity = selectedInventory?.quantity || 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productId) {
      return;
    }

    if (!formData.warehouseId) {
      return;
    }

    if (Number(formData.quantity) > availableQuantity) {
      return;
    }

    onSubmit({
      orderNumber: formData.orderNumber,
      productId: Number(formData.productId),
      warehouseId: Number(formData.warehouseId),
      quantity: Number(formData.quantity)
    });

    setFormData({
      orderNumber: "",
      productId: "",
      warehouseId: "",
      quantity: ""
    });
  };

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Order Number</label>

        <input
          type="text"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          placeholder="ORD005"
          required
        />
      </div>

      <div className="form-group">
        <label>Product</label>

        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
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
          disabled={!formData.productId}
          required
        >
          <option value="">
            {!formData.productId
              ? "Select Product First"
              : availableWarehouses.length === 0
              ? "No Inventory Available"
              : "Select Warehouse"}
          </option>

          {availableWarehouses.map((warehouse) => {
            const stock = availableInventory.find(
              (item) =>
                item.warehouse?.id === warehouse.id
            );

            return (
              <option
                key={warehouse.id}
                value={warehouse.id}
              >
                {warehouse.warehouseCode} - {warehouse.name}{" "}
                ({stock?.quantity || 0} available)
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          max={availableQuantity || undefined}
          disabled={!formData.warehouseId}
          placeholder={
            formData.warehouseId
              ? `Maximum ${availableQuantity}`
              : "Select warehouse first"
          }
          required
        />

        {formData.warehouseId && (
          <small className="available-stock">
            Available stock: {availableQuantity} units
          </small>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="primary-btn"
          disabled={
            !formData.productId ||
            !formData.warehouseId ||
            !formData.quantity ||
            Number(formData.quantity) > availableQuantity
          }
        >
          Create Order
        </button>
      </div>
    </form>
  );
}

export default OrderForm;