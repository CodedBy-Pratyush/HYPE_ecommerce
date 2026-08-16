import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        HYPE
      </Link>

      <button
        className={`navbar-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navbar-links ${open ? "is-open" : ""}`}>
        <Link to="/products" onClick={closeMenu}>
          Shop
        </Link>
        <Link to="/cart" onClick={closeMenu}>
          Cart ({count})
        </Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" onClick={closeMenu}>
                Admin
              </Link>
            )}
            <span className="navbar-greeting">Hi, {user.name}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" onClick={closeMenu}>
              Register
            </Link>
          </>
        )}
      </nav>

      {open && <div className="navbar-backdrop" onClick={closeMenu}></div>}
    </header>
  );
}
