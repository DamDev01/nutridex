"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/schedule", label: "Agenda" },
    { href: "/patients/new", label: "Novo Paciente" },
    { href: "/consultations/new", label: "Nova Consulta" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 p-4">
      <h1 className="text-2xl font-bold mb-8">Nutridex</h1>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={`w-full text-left justify-start ${
                    pathname === item.href ? "bg-blue-500 text-white" : "text-white hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}