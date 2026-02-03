import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { verifyMessage } from "viem";

const app = express();
const PORT = 3001;


const nonces = new Map(); // key: address (lowercase), value: nonce

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5001",
      "http://localhost:5173",
      "http://127.0.0.1:5001",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

// Log every request so I can see if frontend hits the backend
app.use((req, res, next) => {
  console.log("[request]", req.method, req.path);
  next();
});


app.get("/", (req, res) => {
  res.json({ message: "Auth server running", routes: ["GET /auth/nonce", "POST /auth/verify"] });
});

app.get("/auth/nonce", (req, res) => {
  const { address } = req.query;
  console.log("[auth] GET /auth/nonce — address:", address ?? "(missing)");
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is Required" });
  }
  const addr = address.toLowerCase();
  const nonce = crypto.randomUUID();
  nonces.set(addr, nonce);
  res.json({ nonce });
});


app.post("/auth/verify", async (req, res) => {
  try {
    const { address, message, signature } = req.body;
    console.log("[auth] POST /auth/verify — address:", address ?? "(missing)");

    if (!address || !message || !signature) {
      console.log("[auth] Rejected: Missing Fields");
      return res.status(400).json({ ok: false, error: "Missing Fields" });
    }

    const addr = address.toLowerCase();
    const expectedNonce = nonces.get(addr);
    if (!expectedNonce || !message.includes(expectedNonce)) {
      console.log("[auth] Rejected: Invalid Nonce for", addr);
      return res.status(400).json({ ok: false, error: "Invalid Nonce" });
    }

    const ok = await verifyMessage({
      address,
      message,
      signature,
    });

    if (!ok) {
      console.log("[auth] Rejected: Invalid Signature for", addr);
      return res.status(401).json({ ok: false, error: "Invalid Signature" });
    }

    nonces.delete(addr);

    const sessionValue = `user:${addr}`;
   
    res.cookie("session", sessionValue, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",
      path: "/",
    });

    console.log("[auth] Login success:", {
      account: addr,
      sessionCookie: sessionValue,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "server error" });
  }
});


app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.method + " " + req.path,
    routes: [
      "GET /",
      "GET /auth/nonce?address=0x...",
      "POST /auth/verify (body: { address, message, signature })",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
  console.log("Login logs will appear in THIS terminal when users sign in.");
});