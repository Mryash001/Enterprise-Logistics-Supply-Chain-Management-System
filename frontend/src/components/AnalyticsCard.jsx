function AnalyticsCard({ title, value, description }) {
  return (
    <div className="analytics-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </div>
  );
}

export default AnalyticsCard;