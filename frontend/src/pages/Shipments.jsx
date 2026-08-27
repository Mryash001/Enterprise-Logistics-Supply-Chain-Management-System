import { useEffect, useState } from "react";
import Header from "../components/Header";
import ShipmentForm from "../components/ShipmentForm";
import api from "../services/api";

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        shipmentsResponse,
        ordersResponse
      ] = await Promise.all([
        api.get("/shipments"),
        api.get("/orders")
      ]);

      setShipments(shipmentsResponse.data);
      setOrders(ordersResponse.data);

      setError("");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to load shipment data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await api.post("/shipments", null, {
        params: {
          trackingNumber: formData.trackingNumber,
          orderId: formData.orderId,
          carrier: formData.carrier
        }
      });

      setShowForm(false);
      setError("");

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to create shipment");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/shipments/${id}/status`, null, {
        params: {
          status
        }
      });

      setError("");

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to update shipment status");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/shipments/${id}`);

      setError("");

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to delete shipment");
      }
    }
  };

  const getNextStatus = (status) => {
    if (status === "PREPARING") {
      return "SHIPPED";
    }

    if (status === "SHIPPED") {
      return "IN_TRANSIT";
    }

    if (status === "IN_TRANSIT") {
      return "DELIVERED";
    }

    return null;
  };

  return (
    <>
      <Header
        eyebrow="MANAGEMENT"
        title="Shipments"
        subtitle="Create and track supply chain shipments"
        onRefresh={loadData}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="page-actions">
        <button
          className="primary-btn"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
        >
          {showForm ? "Close Form" : "+ Create Shipment"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Shipment</h2>

          <ShipmentForm
            orders={orders}
            shipments={shipments}
            onSubmit={handleCreate}
          />
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">SHIPMENT LIST</p>
            <h2>All Shipments</h2>
          </div>

          <span className="count-badge">
            {shipments.length} shipments
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading shipments...
          </div>
        ) : shipments.length === 0 ? (
          <div className="empty-state">
            No shipments found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tracking Number</th>
                  <th>Order</th>
                  <th>Carrier</th>
                  <th>Status</th>
                  <th>Estimated Delivery</th>
                  <th>Actual Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((shipment) => {
                  const nextStatus = getNextStatus(
                    shipment.status
                  );

                  return (
                    <tr key={shipment.id}>
                      <td>{shipment.id}</td>

                      <td>
                        <span className="code">
                          {shipment.trackingNumber}
                        </span>
                      </td>

                      <td>
                        {shipment.order?.orderNumber}
                      </td>

                      <td>
                        {shipment.carrier}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${shipment.status.toLowerCase()}`}
                        >
                          {shipment.status}
                        </span>
                      </td>

                      <td>
                        {shipment.estimatedDeliveryDate || "-"}
                      </td>

                      <td>
                        {shipment.actualDeliveryDate || "-"}
                      </td>

                      <td>
                        <div className="action-buttons">
                          {nextStatus && (
                            <button
                              className="edit-btn"
                              onClick={() =>
                                updateStatus(
                                  shipment.id,
                                  nextStatus
                                )
                              }
                            >
                              → {nextStatus}
                            </button>
                          )}

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(shipment.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Shipments;