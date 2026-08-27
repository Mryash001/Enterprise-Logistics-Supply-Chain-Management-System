import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Warehouses", path: "/warehouses" },
    { name: "Inventory", path: "/inventory" },
    { name: "Orders", path: "/orders" },
    { name: "Shipments", path: "/shipments" },
    { name: "Tracking", path: "/tracking" },
    { name: "Analytics", path: "/analytics" },
    { name: "Alerts", path: "/alerts" }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">SC</div>

        <div>
          <h2>SupplyChain</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="server-status">
          <span></span>
          Backend Connected
        </div>

        <small>Spring Boot • Port 8081</small>
      </div>
    </aside>
  );
}

export default Sidebar;