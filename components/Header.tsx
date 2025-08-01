"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "primereact/menu";
import LemeLogo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();
  const menuRef = React.useRef<Menu>(null);

  const navItems = [
    { id: "home", label: "Início", path: "/" },
    { id: "history", label: "Histórico", path: "/history" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={LemeLogo}
                alt="Leme Logo"
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? "text-white hover:bg-[#ea580c] bg-[#E15C3A]"
                    : "text-gray-200 hover:text-white hover:bg-[#ea580c]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
