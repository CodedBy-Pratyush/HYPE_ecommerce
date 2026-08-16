import { createContext, useContext, useEffect, useMemo, useState } from "react";

// The cart lives in the browser's localStorage, so it survives a page refresh.
// It does NOT need the user to be logged in.
const CartContext = createContext(null);

const STORAGE_KEY = "hype-cart";

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  // Every time the cart changes, save it back to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product === product._id);

      if (existing) {
        // Already in the cart -> just bump the quantity
        return current.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Not in the cart yet -> add a new line
      return [
        ...current,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
      ];
    });
  }

  function remove(productId) {
    setItems((current) => current.filter((item) => item.product !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }

  function clear() {
    setItems([]);
  }

  // useMemo avoids recalculating the total on every single render
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = { items, add, remove, updateQuantity, clear, total, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
