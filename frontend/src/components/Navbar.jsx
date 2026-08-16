import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        HYPE
      </Link>

      <nav className="navbar-links">
        <Link to="/products">Shop</Link>
        <Link to="/cart">Cart ({count})</Link>

        {user ? (
          <>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <span className="navbar-greeting">Hi, {user.name}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
