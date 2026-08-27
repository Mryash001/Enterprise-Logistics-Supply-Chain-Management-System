import { useEffect, useState } from "react";
import Header from "../components/Header";
import InventoryForm from "../components/InventoryForm";
import api from "../services/api";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [editingInventory, setEditingInventory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        inventoryResponse,
        productsResponse,
        warehousesResponse
      ] = await Promise.all([
        api.get("/inventory"),
        api.get("/products"),
        api.get("/warehouses")
      ]);

      setInventory(inventoryResponse.data);
      setProducts(productsResponse.data);
      setWarehouses(warehousesResponse.data);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingInventory) {
        await api.put(
          `/inventory/${editingInventory.id}`,
          null,
          {
            params: {
              quantity: formData.quantity
            }
          }
        );
      } else {
        await api.post(
          "/inventory",
          null,
          {
            params: {
              productId: formData.productId,
              warehouseId: formData.warehouseId,
              quantity: formData.quantity
            }
          }
        );
      }

      setShowForm(false);
      setEditingInventory(null);

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to save inventory");
      }
    }
  };

  const handleAdd = () => {
    setEditingInventory(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (item) => {
    setEditingInventory(item);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInventory(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/inventory/${id}`);

      await loadData();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to delete inventory");
      }
    }
  };

  return (
    <>
      <Header
        eyebrow="MANAGEMENT"
        title="Inventory"
        subtitle="Manage stock across your warehouses"
        onRefresh={loadData}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="page-actions">
        <button className="primary-btn" onClick={handleAdd}>
          + Add Inventory
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>
            {editingInventory
              ? "Edit Inventory"
              : "Add New Inventory"}
          </h2>

          <InventoryForm
            inventory={editingInventory}
            products={products}
            warehouses={warehouses}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">INVENTORY LIST</p>
            <h2>Stock Overview</h2>
          </div>

          <span className="count-badge">
            {inventory.length} records
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading inventory...
          </div>
        ) : inventory.length === 0 ? (
          <div className="empty-state">
            No inventory records found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Code</th>
                  <th>Product</th>
                  <th>Warehouse Code</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      <span className="code">
                        {item.product?.productCode}
                      </span>
                    </td>

                    <td>
                      {item.product?.name || "-"}
                    </td>

                    <td>
                      <span className="code">
                        {item.warehouse?.warehouseCode}
                      </span>
                    </td>

                    <td>
                      {item.warehouse?.name || "-"}
                    </td>

                    <td>
                      <strong>{item.quantity}</strong>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(item.id)
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

export default Inventory;