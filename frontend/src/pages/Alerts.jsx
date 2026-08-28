import { useEffect, useState } from "react";
import Header from "../components/Header";
import AlertCard from "../components/AlertCard";
import api from "../services/api";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/alerts");

      setAlerts(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load inventory alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <>
      <Header
        eyebrow="ALERTS"
        title="Inventory Alerts"
        subtitle="Monitor products with critically low stock"
        onRefresh={loadAlerts}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="alerts-summary">
        <div className="alert-summary-card">
          <span>Low Stock Items</span>
          <strong>{alerts.length}</strong>
        </div>

        <div className="alert-summary-card">
          <span>Alert Threshold</span>
          <strong>≤ 50</strong>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          Checking inventory alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="no-alerts-card">
          <div className="success-icon">✓</div>

          <h2>All inventory levels are healthy</h2>

          <p>
            No products currently have stock at or below
            the alert threshold.
          </p>
        </div>
      ) : (
        <section className="alerts-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ACTION REQUIRED</p>
              <h2>Low Stock Items</h2>
            </div>

            <span className="count-badge">
              {alerts.length} alerts
            </span>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Alerts;