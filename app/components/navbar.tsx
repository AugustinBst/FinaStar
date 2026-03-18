"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, UserCircle, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/",   label: "Budgets",   icon: PieChart },
  { href: "/",  label: "Profil",    icon: UserCircle },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="navbar bg-base-100 border-b border-base-200 px-6">

      {/* Logo */}
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
            <Sparkles size={22} />
          </div>
          <span className="text-base font-semibold">
            Finastar
          </span>
        </Link>
      </div>

      {/* Nav links */}
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
          <div className="bg-primary text-primary-content  flex justify-center items-center rounded-lg w-8">
            <span className="text-xs">JD</span>
          </div>
        </div>
      </div>

    </div>
  );
}