"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, UserCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profil",  label: "Profil",    icon: UserCircle },
];

interface User {
  id: string;
  pseudo: string;
  age: number | null;
  currency: string;
  avatar: string | null;
  created_at: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("profil1.png");

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
  }, []);


  useEffect(() => {
    const handleAvatarChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedAvatar(customEvent.detail);
    };
    console.log(selectedAvatar)

    window.addEventListener("avatarUpdate", handleAvatarChange);

    return () => {
      window.removeEventListener("avatarUpdate", handleAvatarChange);
    };
  }, []);

  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-6">

      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-accent/10 text-accent p-1.5 rounded-lg">
            <Sparkles size={22} />
          </div>
          <span className="text-base font-semibold">
            Finastar
          </span>
        </Link>
      </div>

      <div className="navbar-center">
        <ul className="menu menu-horizontal gap-1 p-0">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={isActive ? "active" : ""}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="avatar placeholder">
          <Link href="/profil" className="avatar hover:opacity-80 transition-opacity">
            <div className="w-10 rounded-full border-2 border-transparent hover:border-accent">
              <img
                src={`assets/profils/${selectedAvatar}`}
                alt="Avatar de profil"
              />
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}