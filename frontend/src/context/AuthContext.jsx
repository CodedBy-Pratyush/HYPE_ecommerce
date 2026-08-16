import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// React Context lets us share "who is logged in" with every component
// without passing props down manually through every level.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // logged-in user, or null
  const [loading, setLoading] = useState(true);  // true while we check login status

  // When the app first loads, ask the backend "am I logged in?"
  // The backend reads the login cookie and tells us.
  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null)) // not logged in, that's fine
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const data = await api("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    setUser(data.user);
    return data.user;
  }

  async function register(details) {
    const data = await api("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A shortcut so components can write: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
