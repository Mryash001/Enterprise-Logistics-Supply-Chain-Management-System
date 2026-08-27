import { useEffect, useState } from "react";

function WarehouseForm({ warehouse, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    warehouseCode: "",
    name: "",
    location: "",
    managerName: ""
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouseCode: warehouse.warehouseCode || "",
        name: warehouse.name || "",
        location: warehouse.location || "",
        managerName: warehouse.managerName || ""
      });
    } else {
      setFormData({
        warehouseCode: "",
        name: "",
        location: "",
        managerName: ""
      });
    }
  }, [warehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Warehouse Code</label>
        <input
          type="text"
          name="warehouseCode"
          value={formData.warehouseCode}
          onChange={handleChange}
          placeholder="WH002"
          required
        />
      </div>

      <div className="form-group">
        <label>Warehouse Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="North Warehouse"
          required
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Delhi"
        />
      </div>

      <div className="form-group">
        <label>Manager Name</label>
        <input
          type="text"
          name="managerName"
          value={formData.managerName}
          onChange={handleChange}
          placeholder="Rahul Sharma"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {warehouse ? "Update Warehouse" : "Add Warehouse"}
        </button>

        {warehouse && (
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

export default WarehouseForm;