import { useEffect, useState } from "react";
import Header from "../components/Header";
import OrderForm from "../components/OrderForm";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        ordersResponse,
        productsResponse,
        warehousesResponse,
        inventoryResponse
      ] = await Promise.all([
        api.get("/orders"),
        api.get("/products"),
        api.get("/warehouses"),
        api.get("/inventory")
      ]);

      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
      setWarehouses(warehousesResponse.data);
      setInventory(inventoryResponse.data);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load order data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await api.post("/orders", null, {
        params: {
          orderNumber: formData.orderNumber,
          productId: formData.productId,
          warehouseId: formData.warehouseId,
          quantity: formData.quantity
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
        setError("Unable to create order");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, null, {
        params: {
          status
        }
      });

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to update order status");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/orders/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to delete order");
      }
    }
  };

  const getNextStatus = (status) => {
    if (status === "CREATED") {
      return "DISPATCHED";
    }

    if (status === "DISPATCHED") {
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
        title="Orders"
        subtitle="Create and manage supply chain orders"
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
          {showForm ? "Close Form" : "+ Create Order"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Order</h2>

          <OrderForm
            products={products}
            warehouses={warehouses}
            inventory={inventory}
            onSubmit={handleCreate}
          />
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">ORDER LIST</p>
            <h2>All Orders</h2>
          </div>

          <span className="count-badge">
            {orders.length} orders
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            No orders found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Number</th>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);

                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>

                      <td>
                        <span className="code">
                          {order.orderNumber}
                        </span>
                      </td>

                      <td>
                        {order.product?.productCode} -{" "}
                        {order.product?.name}
                      </td>

                      <td>
                        {order.warehouse?.warehouseCode} -{" "}
                        {order.warehouse?.name}
                      </td>

                      <td>
                        <strong>{order.quantity}</strong>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          {nextStatus && (
                            <button
                              className="edit-btn"
                              onClick={() =>
                                updateStatus(order.id, nextStatus)
                              }
                            >
                              → {nextStatus}
                            </button>
                          )}

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(order.id)
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

export default Orders;