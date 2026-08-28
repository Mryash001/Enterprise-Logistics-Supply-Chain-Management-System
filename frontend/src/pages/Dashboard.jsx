import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import api from "../services/api";

function Dashboard() {
  const [overview, setOverview] = useState({
    total_products: 0,
    total_warehouses: 0,
    total_stock: 0,
    total_inventory_value: 0
  });

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewResponse, inventoryResponse] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/inventory")
      ]);

      setOverview(overviewResponse.data || {});
      setInventory(inventoryResponse.data || []);
    } catch (err) {
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (quantity) => {
    const stock = Number(quantity) || 0;

    if (stock <= 20) {
      return "Critical";
    }

    if (stock <= 50) {
      return "Low Stock";
    }

    return "Healthy";
  };

  const healthyCount = inventory.filter(
    (item) => Number(item.quantity) > 50
  ).length;

  const lowStockCount = inventory.filter(
    (item) => Number(item.quantity) > 20 && Number(item.quantity) <= 50
  ).length;

  const criticalCount = inventory.filter(
    (item) => Number(item.quantity) <= 20
  ).length;

  const totalInventoryRecords = inventory.length;

  const getPercentage = (count) => {
    if (totalInventoryRecords === 0) return 0;
    return Math.round((count / totalInventoryRecords) * 100);
  };

  return (
    <>
      <Header
        eyebrow="OVERVIEW"
        title="Supply Chain Dashboard"
        subtitle="Monitor products, inventory, warehouses and operations"
        onRefresh={loadDashboard}
      />

      {error && <div className="error">{error}</div>}

      <section className="stats">
        <StatCard
          title="Total Products"
          value={overview.total_products}
          icon="P"
          description="Products in system"
        />

        <StatCard
          title="Total Warehouses"
          value={overview.total_warehouses}
          icon="W"
          description="Active warehouses"
        />

        <StatCard
          title="Total Stock"
          value={overview.total_stock}
          icon="I"
          description="Units currently available"
        />

        <StatCard
          title="Inventory Value"
          value={formatCurrency(overview.total_inventory_value)}
          icon="₹"
          description="Total inventory worth"
        />
      </section>

      <section className="dashboard-main-grid">

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">INVENTORY OVERVIEW</p>
              <h2>Inventory Health</h2>
            </div>
          </div>

          <p className="section-description">
            Current stock distribution across all products and warehouses.
          </p>

          <div className="inventory-health">

            <div className="health-summary">
              <div className="health-number">
                {totalInventoryRecords}
              </div>

              <div>
                <h3>Inventory Records</h3>
                <p>Across all warehouses</p>
              </div>
            </div>

            <div className="health-bars">

              <div className="health-row">
                <div className="health-label">
                  <span className="dot healthy"></span>
                  Healthy
                  <strong>{healthyCount}</strong>
                </div>

                <div className="health-bar">
                  <span
                    style={{
                      width: `${getPercentage(healthyCount)}%`
                    }}
                  ></span>
                </div>
              </div>

              <div className="health-row">
                <div className="health-label">
                  <span className="dot low"></span>
                  Low Stock
                  <strong>{lowStockCount}</strong>
                </div>

                <div className="health-bar">
                  <span
                    className="low-fill"
                    style={{
                      width: `${getPercentage(lowStockCount)}%`
                    }}
                  ></span>
                </div>
              </div>

              <div className="health-row">
                <div className="health-label">
                  <span className="dot critical"></span>
                  Critical
                  <strong>{criticalCount}</strong>
                </div>

                <div className="health-bar">
                  <span
                    className="critical-fill"
                    style={{
                      width: `${getPercentage(criticalCount)}%`
                    }}
                  ></span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">QUICK ACTIONS</p>
              <h2>Manage Operations</h2>
            </div>
          </div>

          <div className="quick-actions">

            <Link to="/products" className="quick-action">
              <span className="quick-action-icon blue">
                P
              </span>

              <div>
                <strong>Add Product</strong>
                <span>Manage product catalog</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/inventory" className="quick-action">
              <span className="quick-action-icon green">
                I
              </span>

              <div>
                <strong>Add Inventory</strong>
                <span>Update stock levels</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/orders" className="quick-action">
              <span className="quick-action-icon purple">
                O
              </span>

              <div>
                <strong>Create Order</strong>
                <span>Place a new order</span>
              </div>

              <span>→</span>
            </Link>

            <Link to="/tracking" className="quick-action">
              <span className="quick-action-icon orange">
                T
              </span>

              <div>
                <strong>Track Shipment</strong>
                <span>Manage deliveries</span>
              </div>

              <span>→</span>
            </Link>

          </div>
        </div>

      </section>

      <section className="table-card">

        <div className="table-header">
          <div>
            <p className="eyebrow">RECENT STOCK OVERVIEW</p>
            <h2>Inventory</h2>
          </div>

          <Link to="/inventory" className="view-link">
            View all inventory →
          </Link>
        </div>

        {loading ? (
          <div className="table-message">
            Loading inventory...
          </div>
        ) : inventory.length === 0 ? (
          <div className="table-message">
            No inventory records found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {inventory.slice(0, 5).map((item, index) => {
                  const status = getStockStatus(item.quantity);

                  return (
                    <tr
                      key={`${item.product_code}-${item.warehouse_code}-${index}`}
                    >
                      <td>
                        <div className="product-cell">
                          <span className="product-icon">
                            {item.product_name?.charAt(0) || "P"}
                          </span>

                          <div>
                            <strong>{item.product_name}</strong>
                            <small>{item.product_code}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="warehouse-cell">
                          <strong>{item.warehouse_name}</strong>
                          <small>{item.warehouse_code}</small>
                        </div>
                      </td>

                      <td className="quantity-cell">
                        {item.quantity}
                      </td>

                      <td>
                        <span
                          className={`stock-badge ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && inventory.length > 5 && (
          <div className="table-footer">
            Showing 5 of {inventory.length} inventory records
          </div>
        )}

      </section>
    </>
  );
}

export default Dashboard;