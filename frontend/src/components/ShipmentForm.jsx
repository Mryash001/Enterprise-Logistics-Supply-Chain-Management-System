import { useState } from "react";

function ShipmentForm({ orders, shipments, onSubmit }) {
  const [formData, setFormData] = useState({
    trackingNumber: "",
    orderId: "",
    carrier: ""
  });

  const shipmentOrderIds = shipments.map(
    (shipment) => shipment.order?.id
  );

  const availableOrders = orders.filter(
    (order) => !shipmentOrderIds.includes(order.id)
  );

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
      trackingNumber: formData.trackingNumber,
      orderId: Number(formData.orderId),
      carrier: formData.carrier
    });

    setFormData({
      trackingNumber: "",
      orderId: "",
      carrier: ""
    });
  };

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tracking Number</label>

        <input
          type="text"
          name="trackingNumber"
          value={formData.trackingNumber}
          onChange={handleChange}
          placeholder="TRK005"
          required
        />
      </div>

      <div className="form-group">
        <label>Order</label>

        <select
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          required
        >
          <option value="">Select Order</option>

          {availableOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.orderNumber} - {order.product?.name} -{" "}
              {order.quantity} units
            </option>
          ))}
        </select>

        {availableOrders.length === 0 && (
          <small className="available-stock">
            No orders available for shipment.
          </small>
        )}
      </div>

      <div className="form-group">
        <label>Carrier</label>

        <select
          name="carrier"
          value={formData.carrier}
          onChange={handleChange}
          required
        >
          <option value="">Select Carrier</option>
          <option value="BlueDart">BlueDart</option>
          <option value="Delhivery">Delhivery</option>
          <option value="DTDC">DTDC</option>
          <option value="FedEx">FedEx</option>
          <option value="DHL">DHL</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="primary-btn"
          disabled={
            !formData.trackingNumber ||
            !formData.orderId ||
            !formData.carrier
          }
        >
          Create Shipment
        </button>
      </div>
    </form>
  );
}

export default ShipmentForm;