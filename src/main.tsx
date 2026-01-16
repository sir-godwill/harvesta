import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

console.log("main.tsx: script started");

const rootElement = document.getElementById("root");

if (!rootElement) {
    console.error("main.tsx: FATAL - Root element 'root' not found in document");
} else {
    try {
        console.log("main.tsx: Found root element, mounting React root...");
        createRoot(rootElement).render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );
        console.log("main.tsx: React render call completed");
    } catch (err) {
        console.error("main.tsx: Exception during createRoot/render", err);
    }
}
