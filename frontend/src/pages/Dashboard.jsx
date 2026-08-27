import { useEffect, useState } from "react";
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

  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      const [inventoryResponse, productsResponse, warehousesResponse] =
        await Promise.all([
          api.get("/analytics/inventory"),
          api.get("/products"),
          api.get("/warehouses")
        ]);

      const inventory = inventoryResponse.data;
      const products = productsResponse.data;
      const warehouses = warehousesResponse.data;

      const totalStock = inventory.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      const inventoryValue = inventory.reduce((sum, item) => {
        const product = products.find(
          (p) => p.productCode === item.product_code
        );

        const price = product ? Number(product.price || 0) : 0;

        return sum + Number(item.quantity || 0) * price;
      }, 0);

      setOverview({
        total_products: products.length,
        total_warehouses: warehouses.length,
        total_stock: totalStock,
        total_inventory_value: inventoryValue
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend");
    }
  };

  useEffect(() => {
    loadOverview();
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
        eyebrow="OVERVIEW"
        title="Supply Chain Dashboard"
        subtitle="Monitor products, inventory, orders and shipments"
        onRefresh={loadOverview}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

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

      <section className="content-grid">
        <div className="welcome-card">
          <div className="welcome-content">
            <p className="eyebrow">SYSTEM STATUS</p>

            <h2>Everything is connected</h2>

            <p>
              Your React frontend is successfully communicating
              with the Spring Boot backend and MySQL database.
            </p>
          </div>

          <div className="flow">
            <div>React</div>
            <span>→</span>
            <div>Spring Boot</div>
            <span>→</span>
            <div>MySQL</div>
          </div>
        </div>

        <div className="quick-card">
          <p className="eyebrow">QUICK ACCESS</p>

          <h2>Management Modules</h2>

          <div className="quick-list">
            <div>
              <span>Products</span>
              <strong>→</strong>
            </div>

            <div>
              <span>Inventory</span>
              <strong>→</strong>
            </div>

            <div>
              <span>Orders</span>
              <strong>→</strong>
            </div>

            <div>
              <span>Shipments</span>
              <strong>→</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;