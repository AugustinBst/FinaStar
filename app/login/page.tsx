"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      router.push("/");
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-200">
      <div className="card bg-base-300 border border-base-700 w-96 shadow-xl">
        <div className="card-body flex flex-col gap-4">
          <h2 className="card-title text-2xl font-bold">Finastar</h2>
          <p className="text-base-content/60 text-sm">Sign in to your account</p>
          <p className="text-base-content/60 text-sm">Or <Link href="/register" className="text-accent text-sm hover:underline">register</Link> </p>


          <input
            type="text"
            placeholder="Pseudo"
            className="input input-accent w-full"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-accent w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            className="btn btn-accent text-base-content w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner" /> : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}