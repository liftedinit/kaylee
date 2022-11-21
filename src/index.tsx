import React from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import AppProvider from "./components/AppProvider";

const root = document.getElementById("root");
createRoot(root!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
