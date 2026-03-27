"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, removeToken } from "@/lib/api";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  pseudo: string;
  age: number | null;
  currency: string;
  avatar: string | null;
  created_at: string;
}

const AVATARS = ["profil1.png", "profil2.png", "profil3.png"];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("profil1.png");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    apiFetch("/auth/me")
      .then((res: Response) => res.json())
      .then((data: User) => {
        setUser(data);
        setSelectedAvatar(data.avatar || "profil1.png");
        setLoading(false);
      });
  }, [router]);

  const handleSaveAvatar = async (newAvatar: string) =>  {
    setSaving(true);
    try {
      await apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ avatar: newAvatar }),
      });
      setSaved(true);
      setUser((prev) => prev ? { ...prev, avatar: newAvatar } : prev);
      window.dispatchEvent(new CustomEvent("avatarUpdate", { detail: newAvatar }));
      setTimeout(() => setSaved(false), 700);
    } catch (error) {
      console.error("Failed to save avatar", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-accent" />
    </div>
  );

  if (!user) return null;

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-xl flex flex-col gap-6">

        <div className="flex items-center justify-between mb-2">
          <button onClick={() => router.push("/")} className="btn btn-ghost btn-sm gap-2 text-base-content/60">
            ← Back
          </button>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-2 text-error">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="card bg-base-300 border border-base-700">
          <div className="card-body items-center gap-6">
            <div className="relative">
              <Image
                src={`/assets/profils/${selectedAvatar}`}
                alt="avatar"
                width={96}
                height={96}
                className="rounded-full ring-2 ring-accent ring-offset-2 ring-offset-base-300"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{user.pseudo}</h1>
              <p className="text-base-content/50 text-sm mt-1">Member since {memberSince}</p>
            </div>

            {/* Avatar picker */}
            <div className="flex gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`rounded-full ring-2 ring-offset-2 ring-offset-base-300 transition-all ${
                    selectedAvatar === avatar ? "ring-accent scale-110" : "ring-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={`/assets/profils/${avatar}`}
                    alt={avatar}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </button>
              ))}
            </div>

            {selectedAvatar !== (user.avatar || "profil1.png") && (
              <button
                className="btn btn-accent btn-sm"
                onClick={() => handleSaveAvatar(selectedAvatar)}
                disabled={saving}
              >
                {saving ? <span className="loading loading-spinner loading-xs" /> : saved ? "Saved ✓" : "Save avatar"}
              </button>
            )}
          </div>
        </div>

        <div className="card bg-base-300 border border-base-700">
          <div className="card-body gap-4">
            <h2 className="font-semibold text-base-content/60 text-sm uppercase tracking-widest">Account info</h2>

            <div className="flex justify-between items-center py-3 border-b border-base-700">
              <span className="text-base-content/50 text-sm">Username</span>
              <span className="font-semibold">{user.pseudo}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-base-700">
              <span className="text-base-content/50 text-sm">Age</span>
              <span className="font-semibold">{user.age ?? "—"}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-base-content/50 text-sm">Currency</span>
              <span className="font-semibold">{user.currency}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-base-content/30 text-xs font-mono">ID {user.id}</p>

      </div>
    </div>
  );
}