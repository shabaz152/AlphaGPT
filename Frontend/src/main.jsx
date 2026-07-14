import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="170372320143-msvtovvoecdkq10dobr4duqcst77qfe8.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);