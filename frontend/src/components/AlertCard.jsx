function AlertCard({ alert }) {
  return (
    <div className="alert-card">
      <div className="alert-icon">!</div>

      <div className="alert-content">
        <div className="alert-title-row">
          <h3>{alert.product_name}</h3>

          <span className="low-stock-badge">
            LOW STOCK
          </span>
        </div>

        <p>
          Product: <strong>{alert.product_code}</strong>
        </p>

        <p>
          Warehouse:{" "}
          <strong>
            {alert.warehouse_name}
          </strong>{" "}
          ({alert.warehouse_code})
        </p>

        <div className="stock-warning">
          <span>Available Quantity</span>
          <strong>{alert.quantity}</strong>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;