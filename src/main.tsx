import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiAdapter } from "./appkit.js";
import App from "./App.js";
import "./index.css";


if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || "");
    if (
      message.includes("Analytics SDK") ||
      message.includes("cca-lite.coinbase.com") ||
      message.includes("ERR_CERT_AUTHORITY_INVALID")
    ) {
      return; 
    }
    originalError.apply(console, args);
  };
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
