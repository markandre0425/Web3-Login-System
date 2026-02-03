import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, type AppKitNetwork } from "@reown/appkit/networks";

/* Project ID from https://dashboard.reown.com */
const projectId =
  import.meta.env.VITE_PROJECT_ID ??
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
  "";

if (!projectId) {
  console.warn(
    "Reown AppKit: No project ID."
  );
}

// Description and icon (shown in the connect modal)
const metadata = {
  name: "Web3 Login",
  description: "Web3 Login with MetaMask",
  url: typeof window !== "undefined" ? window.location.origin : "http://localhost:5001",
  icons: ["https://avatars.githubusercontent.com/u/179229932"], // logo URL(s)
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

// To customize the connect modal: light/dark, colors, font, radius, etc.
// Docs @ https://docs.reown.com/appkit/react/core/theming
const themeVariables = {
  "--apkt-accent": "#6366f1", // buttons, links (e.g. brand color)
  "--apkt-color-mix": "#6366f1",
  "--apkt-color-mix-strength": 30,
  "--apkt-font-family": "system-ui, sans-serif",
  "--apkt-border-radius-master": "12px",
};

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeMode: "dark", // "light" | "dark" | "system"
  themeVariables,
  features: {
    analytics: false,
  },
});

export { wagmiAdapter, projectId };
