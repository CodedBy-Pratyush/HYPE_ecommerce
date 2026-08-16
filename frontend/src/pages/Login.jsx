import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="form-page">
      <h1>Login</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        <Message type="error">{error}</Message>

        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
      </form>

      <p>
        No account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
}
