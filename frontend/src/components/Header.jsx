function Header({ eyebrow, title, subtitle, onRefresh }) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      {onRefresh && (
        <button className="refresh-btn" onClick={onRefresh}>
          ↻ Refresh
        </button>
      )}
    </header>
  );
}

export default Header;