import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

console.log("✓ main.tsx: script started");

const rootElement = document.getElementById("root");

if (!rootElement) {
    console.error("✗ main.tsx: FATAL - Root element 'root' not found in document");
    console.error("DOM content:", document.body.innerHTML.substring(0, 500));
} else {
    try {
        console.log("✓ main.tsx: Found root element, mounting React app...");
        const root = createRoot(rootElement);
        
        root.render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );
        
        console.log("✓ main.tsx: React render call completed successfully");
        
        // Monitor if app becomes blank after initial render
        setTimeout(() => {
          if (rootElement.innerHTML.trim() === "" || rootElement.innerText.trim() === "") {
            console.warn("⚠️ main.tsx: App rendered but content is empty");
          }
        }, 2000);
    } catch (err) {
        console.error("✗ main.tsx: Exception during app initialization:", err);
        // Try to show error on page
        if (rootElement) {
            rootElement.innerHTML = `
                <div style="padding: 20px; font-family: monospace; color: red;">
                    <h1>Application Error</h1>
                    <pre>${String(err).substring(0, 500)}</pre>
                </div>
            `;
        }
    }
}
