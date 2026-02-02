/// <reference types="vite/client" />
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";


export const projectID =
  import.meta.env.VITE_PROJECT_ID ??
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
  "";

if (!projectID) {
  throw new Error(
    "Project ID is not defined"
  );
}

export const networks = [mainnet, arbitrum];


export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectID,
  ssr: false,
});
