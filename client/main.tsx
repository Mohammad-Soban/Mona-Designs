import { createRoot } from "react-dom/client";
import App from "./App";

// Get the root element
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Create root only if it doesn't exist
let root = (container as any)._reactRoot;

if (!root) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
}

// Render the app
root.render(<App />);
