import { useState, useEffect } from "react";
import { useDisconnect, useWalletClient } from "wagmi";
import { AppKitButton, useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { projectId } from "./appkit.js";
import blincIcon from "./blinc-icon.svg";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function App() {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsSignedIn(false);
      setAuthError(null);
    }
  }, [isConnected]);

  if (!projectId) {
    return (
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <img src={blincIcon} alt="Blinc" style={styles.titleIcon} />
          <h2 style={styles.title}>Not configured</h2>
        </div>
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
    const handleVerifyLogin = async () => {
      console.log("[auth] Sign In clicked, walletClient:", !!walletClient);
      if (!walletClient) {
        setAuthError("Wallet not ready. Try again in a moment.");
        return;
      }
      setAuthError(null);
      setIsVerifying(true);
      const apiBase = "http://localhost:3001";
      try {
        console.log("[auth] Fetching nonce from", `${apiBase}/auth/nonce?address=...`);
        const nonceRes = await fetch(
          `${apiBase}/auth/nonce?address=${encodeURIComponent(address)}`,
          { credentials: "include" }
        );
        console.log("[auth] Nonce response:", nonceRes.status, nonceRes.ok);
        if (!nonceRes.ok) {
          const err = await nonceRes.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || `Backend ${nonceRes.status}`);
        }
        const nonceJson = await nonceRes.json();
        const nonce = nonceJson.nonce as string;

        const message = `Sign in to Web3 Login\nAddress: ${address}\nNonce: ${nonce}`;

        const signature = await walletClient.signMessage({
          account: address as `0x${string}`,
          message,
        });

        console.log("[auth] Sending verify to", `${apiBase}/auth/verify`);
        const verifyRes = await fetch(`${apiBase}/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ address, message, signature }),
        });
        console.log("[auth] Verify response:", verifyRes.status, verifyRes.ok);
        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok) {
          throw new Error((verifyData as { error?: string }).error || `Verify ${verifyRes.status}`);
        }
        if ((verifyData as { ok?: boolean }).ok) {
          setIsSignedIn(true);
        }
      } catch (e) {
        console.error("[auth] Sign-in error:", e);
        setAuthError(e instanceof Error ? e.message : "Sign-in failed");
      } finally {
        setIsVerifying(false);
      }
    };

    return (
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <img src={blincIcon} alt="Blinc" style={styles.titleIcon} />
          <h2 style={styles.title}>Connected</h2>
        </div>
        <p style={styles.address}>{shortenAddress(address)}</p>
        {authError && (
          <p style={styles.error}>{authError}</p>
        )}
        {isSignedIn ? (
          <p style={styles.success}>Signed in. Session cookie set.</p>
        ) : (
          <button
            style={styles.buttonSecondary}
            onClick={handleVerifyLogin}
            type="button"
            disabled={isVerifying}
          >
            {isVerifying ? "Signing In..." : "Sign In"}
          </button>
        )}
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
      <div style={styles.titleRow}>
        <img src={blincIcon} alt="Blinc" style={styles.titleIcon} />
        <h2 style={styles.title}>Web3 Login</h2>
      </div>
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
    background: "rgba(26, 26, 30, 0.78)",
    backdropFilter: "blur(10px)",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    textAlign: "center",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  titleIcon: {
    width: 32,
    height: 32,
  },
  title: {
    margin: 0,
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
  error: {
    margin: "0 0 12px",
    fontSize: 13,
    color: "#f87171",
  },
  success: {
    margin: "0 0 12px",
    fontSize: 13,
    color: "#4ade80",
  },
};

export default App;
