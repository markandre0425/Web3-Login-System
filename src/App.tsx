import { useDisconnect } from "wagmi";
import { AppKitButton, useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { projectId } from "./appkit.js";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function App() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  if (!projectId) {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Not configured</h2>
        <p style={styles.subtitle}>
          Set <code style={styles.code}>VITE_PROJECT_ID</code> or{" "}
          <code style={styles.code}>VITE_WALLETCONNECT_PROJECT_ID</code> in your
          environment. Get a free Project ID at{" "}
          <a
            href="https://dashboard.reown.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            dashboard.reown.com
          </a>
          .
        </p>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Connected</h2>
        <p style={styles.address}>{shortenAddress(address)}</p>
        <button
          style={styles.buttonSecondary}
          onClick={() => open()}
          type="button"
        >
          Account / Network
        </button>
        <button
          style={styles.button}
          onClick={() => disconnect()}
          type="button"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Web3 Login</h2>
      <p style={styles.subtitle}>Connect with MetaMask or any wallet</p>
      <div style={styles.connectButtonWrapper}>
        <AppKitButton label="Connect Wallet" loadingLabel="Connecting…" />
      </div>
      <p style={styles.hint}>
        Or use your own button:{" "}
        <button
          style={styles.buttonLink}
          onClick={() => open()}
          type="button"
        >
          Open Connect Modal
        </button>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#1a1a1e",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    width: "100%",
  },
  title: {
    margin: "0 0 8px",
    fontSize: 20,
    fontWeight: 600,
  },
  subtitle: {
    margin: "0 0 16px",
    color: "#a1a1aa",
    fontSize: 14,
  },
  code: {
    background: "#27272a",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 13,
  },
  link: {
    color: "#818cf8",
    textDecoration: "none",
  },
  connectButtonWrapper: {
    width: "100%",
    marginBottom: 8,
  },
  address: {
    margin: "0 0 16px",
    fontFamily: "monospace",
    fontSize: 14,
    color: "#e4e4e7",
  },
  button: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  },
  buttonSecondary: {
    background: "transparent",
    color: "#a1a1aa",
    border: "1px solid #3f3f46",
    borderRadius: 8,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: "#71717a",
  },
  buttonLink: {
    background: "none",
    border: "none",
    color: "#818cf8",
    cursor: "pointer",
    fontSize: 12,
    textDecoration: "underline",
    padding: 0,
  },
};

export default App;
