import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import App from "./App";
import DataLayer from "./context/DataLayer";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataLayer>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      <Toaster />
    </DataLayer>
  </StrictMode>
);
