// A tiny reusable component for showing loading / error / empty states.
// Keeping this in one place means every page shows messages the same way.
export default function Message({ type = "info", children }) {
  if (!children) return null;
  return <p className={`message message-${type}`}>{children}</p>;
}
