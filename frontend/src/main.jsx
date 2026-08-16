import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles.css";

// This is the entry point of the whole app.
// It wraps <App /> with:
//  - BrowserRouter  -> lets us use <Link> and page routes
//  - AuthProvider   -> keeps track of who is logged in, everywhere
//  - CartProvider   -> keeps track of the shopping cart, everywhere
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
