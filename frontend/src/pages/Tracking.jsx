import { useState } from "react";
import Header from "../components/Header";
import TrackingForm from "../components/TrackingForm";
import api from "../services/api";

function Tracking() {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchShipment = async (trackingNumber) => {
    try {
      setLoading(true);
      setError("");
      setShipment(null);

      const response = await api.get(
        `/shipments/tracking/${encodeURIComponent(trackingNumber)}`
      );

      setShipment(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 404) {
        setError("Shipment not found");
      } else {
        setError("Unable to find shipment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        eyebrow="TRACKING"
        title="Track Shipment"
        subtitle="Search shipments using their tracking number"
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-card">
        <p className="eyebrow">SHIPMENT SEARCH</p>

        <h2>Enter Tracking Number</h2>

        <TrackingForm
          onSearch={searchShipment}
          loading={loading}
        />
      </div>

      {shipment && (
        <div className="tracking-result">
          <div className="tracking-header">
            <div>
              <p className="eyebrow">SHIPMENT DETAILS</p>
              <h2>{shipment.trackingNumber}</h2>
            </div>

            <span className="status-badge">
              {shipment.status}
            </span>
          </div>

          <div className="tracking-grid">
            <div className="detail-card">
              <span>Carrier</span>
              <strong>{shipment.carrier}</strong>
            </div>

            <div className="detail-card">
              <span>Tracking Number</span>
              <strong>{shipment.trackingNumber}</strong>
            </div>

            <div className="detail-card">
              <span>Estimated Delivery</span>
              <strong>
                {shipment.estimatedDeliveryDate || "-"}
              </strong>
            </div>

            <div className="detail-card">
              <span>Actual Delivery</span>
              <strong>
                {shipment.actualDeliveryDate || "-"}
              </strong>
            </div>
          </div>

          {shipment.order && (
            <div className="order-details">
              <p className="eyebrow">ORDER INFORMATION</p>

              <h2>
                Order {shipment.order.orderNumber}
              </h2>

              <div className="tracking-grid">
                <div className="detail-card">
                  <span>Product</span>
                  <strong>
                    {shipment.order.product?.name || "-"}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Product Code</span>
                  <strong>
                    {shipment.order.product?.productCode || "-"}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Quantity</span>
                  <strong>
                    {shipment.order.quantity ?? "-"}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Warehouse</span>
                  <strong>
                    {shipment.order.warehouse?.name || "-"}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Warehouse Code</span>
                  <strong>
                    {shipment.order.warehouse?.warehouseCode || "-"}
                  </strong>
                </div>

                <div className="detail-card">
                  <span>Order Status</span>
                  <strong>
                    {shipment.order.status || "-"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Tracking;