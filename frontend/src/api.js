// This file has ONE job: talk to our backend server.
// Every other file in the app calls the `api()` function below
// instead of writing `fetch(...)` everywhere.

// The backend URL comes from the .env file (VITE_API_URL).
// If it's missing, we fall back to the default local address.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// A small wrapper around fetch().
// path    -> e.g. "/products" (gets added after API_URL)
// options -> normal fetch options: { method, headers, body }
export async function api(path, options = {}) {
  const response = await fetch(API_URL + path, {
    // "include" sends the login cookie with every request
    credentials: "include",
    ...options,
  });

  // Try to read the response as JSON.
  // If the server crashed and sent back HTML/nothing, don't blow up here.
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: "Server sent back an invalid response." };
  }

  // If the backend responded with an error status (400, 401, 500...),
  // throw a JS Error so the calling component can catch it.
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
