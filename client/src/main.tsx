import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { MainLayout } from "./components/MainLayout.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="overflow-x-hidden">

    <ThemeProvider>
      <Router>
        <ProtectedRoute>
          <MainLayout>
            <App />
          </MainLayout>
        </ProtectedRoute>
      </Router>
    </ThemeProvider>
    </div>
  </StrictMode>,
);
