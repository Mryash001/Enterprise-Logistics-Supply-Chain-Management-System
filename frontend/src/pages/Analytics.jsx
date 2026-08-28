import { useEffect, useState } from "react";
import Header from "../components/Header";
import AnalyticsCard from "../components/AnalyticsCard";
import api from "../services/api";

function Analytics() {
  const [overview, setOverview] = useState({
    total_products: 0,
    total_warehouses: 0,
    total_stock: 0,
    total_inventory_value: 0
  });

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const [overviewResponse, inventoryResponse] =
        await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/inventory")
        ]);

      setOverview(overviewResponse.data);
      setInventory(inventoryResponse.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Header
        eyebrow="ANALYTICS"
        title="Supply Chain Analytics"
        subtitle="Analyze inventory and warehouse performance"
        onRefresh={loadAnalytics}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          Loading analytics...
        </div>
      ) : (
        <>
          <section className="analytics-stats">
            <AnalyticsCard
              title="Total Products"
              value={overview.total_products}
              description="Products in the system"
            />

            <AnalyticsCard
              title="Total Warehouses"
              value={overview.total_warehouses}
              description="Warehouses in the system"
            />

            <AnalyticsCard
              title="Total Stock"
              value={overview.total_stock}
              description="Units currently in inventory"
            />

            <AnalyticsCard
              title="Inventory Value"
              value={formatCurrency(
                overview.total_inventory_value
              )}
              description="Total inventory worth"
            />
          </section>

          <section className="table-card analytics-table">
            <div className="table-header">
              <div>
                <p className="eyebrow">INVENTORY ANALYSIS</p>
                <h2>Stock by Product & Warehouse</h2>
              </div>

              <span className="count-badge">
                {inventory.length} records
              </span>
            </div>

            {inventory.length === 0 ? (
              <div className="empty-state">
                No inventory data available.
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product Code</th>
                      <th>Product</th>
                      <th>Warehouse Code</th>
                      <th>Warehouse</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {inventory.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="code">
                            {item.product_code}
                          </span>
                        </td>

                        <td>
                          {item.product_name}
                        </td>

                        <td>
                          <span className="code">
                            {item.warehouse_code}
                          </span>
                        </td>

                        <td>
                          {item.warehouse_name}
                        </td>

                        <td>
                          <strong>
                            {item.quantity}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default Analytics;