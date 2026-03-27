"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";
import Image from "next/image";

const AVATARS = ["profil1.png", "profil2.png", "profil3.png"];
const CURRENCIES = ["€", "$",  "£", "¥", "₣"];

export default function RegisterPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [currency, setCurrency] = useState("EUR");
  const [avatar, setAvatar] = useState("profil1.png");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password, age, currency, avatar }),
    });

    if (res.ok) {
      const loginRes = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });
      const data = await loginRes.json();
      setToken(data.access_token);
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.detail || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-12 font-sans">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="text-center">
            <h1 className="text-3xl font-bold">Finastar</h1>
            <p className="text-base-content/50 text-sm mt-1">Create your account</p>
        </div>

        <div className="card bg-base-300 border border-base-700">
          <div className="card-body items-center gap-4">
            <Image
              src={`/assets/profils/${avatar}`}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full ring-2 ring-accent ring-offset-2 ring-offset-base-300"
            />
            <div className="flex gap-4">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`rounded-full ring-2 ring-offset-2 ring-offset-base-300 transition-all ${
                    avatar === a ? "ring-accent scale-110" : "ring-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image
                    src={`/assets/profils/${a}`}
                    alt={a}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-300 border border-base-700">
          <div className="card-body gap-4">
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
            />
            <input
              type="number"
              placeholder="Age"
              className="input input-accent w-full"
              min={13}
              max={120}
              value={age ?? ""}
              onChange={(e) => setAge(e.target.valueAsNumber)}
            />
            <select
              className="select select-accent w-full"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {error && <p className="text-error text-sm">{error}</p>}

            <button
              className="btn btn-accent text-base-content w-full"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner" /> : "Create account"}
            </button>
          </div>
        </div>

        <p className="text-center text-base-content/40 text-sm">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-accent hover:underline">
            Sign in
          </button>
        </p>

      </div>
    </div>
  );
}