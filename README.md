# Web3 Login System

Wallet connect using [Reown AppKit](https://docs.reown.com/appkit/react/core/installation) + [wagmi](https://wagmi.sh) + [viem](https://viem.sh). Pre-built connect modal, MetaMask and other wallets, free [Reown](https://dashboard.reown.com) Project ID.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Get a Project ID (required for AppKit)**

   - Go to [Reown Dashboard](https://dashboard.reown.com)
   - Create a project and copy the **Project ID**
   - Add to `.env` in the project root:

   ```
   VITE_PROJECT_ID=your_project_id_here
   ```

   Or use `VITE_WALLETCONNECT_PROJECT_ID` if you already have one.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5001](http://localhost:5001).

## What’s included

- **Reown AppKit**: Connect modal, WalletConnect + Injected + Coinbase connectors
- **`<AppKitButton />`**: Pre-built connect button
- **`useAppKit()`**: `open()` to open the modal (e.g. custom “Open Connect Modal” button)
- **`useAppKitAccount()`**: `address`, `isConnected`
- **wagmi** for disconnect and underlying config

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
