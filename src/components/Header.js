import React, { useEffect,useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const pageData = {
  "/": { title: "Головна", icon: "home.png" },
  "/calendar": { title: "Календар", icon: "home.png" },
  "/notes": { title: "Нотатник", icon: "acts.png" },
  "/new": { title: "Тамагочі", icon: "settle.png" },
  "/tips": { title: "Селфхелп", icon: "transfer.png" },
};


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageData[location.pathname]?.title || "RESOURSeHub";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user_ = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.reload(); 
    navigate("/login");
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
      setUser(JSON.parse(storedUser));
      }
  }, []);

  const isAuthenticated = !!user;

  return (
    <>
      {/* Верхній хедер */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: role !== "user" && isAuthenticated ? 235 : 0,
          right: 0,
          height: "60px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0 }}>{pageTitle}</h2>
        {isAuthenticated ? (
          <>
            <h2>{user ? `Вітаємо, ${user.username}!` : "Ласкаво просимо!"}</h2>
            <button
              onClick={handleLogout}
              style={{ padding: "8px 15px", cursor: "pointer" }}
            >
              Вийти
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            Увійти
          </button>
        )}
      </header>

      {/* Бокове меню  */}
      {isAuthenticated  && (
        <nav
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "215px",
            height: "100vh",
            backgroundColor: "var(--main-color-1)",
            borderRight: "1px solid #ddd",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            overflowY: "auto",
          }}
        >
          <h2>
            <Link
              to="/"
              style={{
                padding: "8px",
                textDecoration: "none",
                borderRadius: "15px",
              }}
            >
              {/* <img
                src={"./image/header/header.png"}
                alt={`Home Image`}
                className="home-image"
                style={{ width: "46px", height: "46px", marginRight: "6px" }}
              /> */}
              RESOURSeHub
            </Link>
          </h2>
          {Object.entries(pageData)
            .filter(([path]) => role === "admin" || path !== "/admin") // Приховуємо адмінські сторінки для не-адмінів
            .map(([path, { title, icon }]) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: location.pathname === path ? "#FFFFFF" : "black",
                  fontWeight: location.pathname === path ? "bold" : "normal",
                  backgroundColor: location.pathname === path ? "#8AAEE0" : "transparent",
                  borderRadius: "5px",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#8AAEE0";
                  e.target.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor =
                    location.pathname === path ? "#8AAEE0" : "transparent";
                  e.target.style.color = location.pathname === path ? "#FFFFFF" : "black";
                }}
              >
                {/* <img
                  src={`./image/header/${icon}`}
                  alt={title}
                  style={{ width: "20px", height: "20px", marginRight: "10px" }}
                /> */}
                {title}
              </Link>
            ))}

            
        </nav>
      )}
    </>
  );
};

export default Header;
