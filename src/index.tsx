import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeLogging, logger } from "./utils/logger";

initializeLogging();

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter basename="luna">
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  logger.error("Root element not found");
}
reportWebVitals();
