import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import "./assets/style.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("root container not found");
}

const root = createRoot(container);
root.render(<App />);
