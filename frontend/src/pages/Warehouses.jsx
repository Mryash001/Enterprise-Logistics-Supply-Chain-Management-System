import { useEffect, useState } from "react";
import Header from "../components/Header";
import WarehouseForm from "../components/WarehouseForm";
import api from "../services/api";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWarehouses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/warehouses");

      setWarehouses(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingWarehouse) {
        await api.put(
          `/warehouses/${editingWarehouse.id}`,
          formData
        );
      } else {
        await api.post("/warehouses", formData);
      }

      setShowForm(false);
      setEditingWarehouse(null);

      await loadWarehouses();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to save warehouse");
      }
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/warehouses/${id}`);

      await loadWarehouses();
    } catch (err) {
      console.error(err);
      setError("Unable to delete warehouse");
    }
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWarehouse(null);
  };

  return (
    <>
      <Header
        eyebrow="MANAGEMENT"
        title="Warehouses"
        subtitle="Manage your supply chain warehouses"
        onRefresh={loadWarehouses}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="page-actions">
        <button className="primary-btn" onClick={handleAdd}>
          + Add Warehouse
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>
            {editingWarehouse
              ? "Edit Warehouse"
              : "Add New Warehouse"}
          </h2>

          <WarehouseForm
            warehouse={editingWarehouse}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <p className="eyebrow">WAREHOUSE LIST</p>
            <h2>All Warehouses</h2>
          </div>

          <span className="count-badge">
            {warehouses.length} warehouses
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading warehouses...
          </div>
        ) : warehouses.length === 0 ? (
          <div className="empty-state">
            No warehouses found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Warehouse Code</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td>{warehouse.id}</td>
                    <td>{warehouse.warehouseCode}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.location || "-"}</td>
                    <td>{warehouse.managerName || "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(warehouse)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(warehouse.id)
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

export default Warehouses;