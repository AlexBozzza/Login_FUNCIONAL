"use client";

import { useRouter } from "next/navigation";
import { Home, Users, Dog, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/");
  };

  return (
    <>
      {/* ✅ Botón hamburguesa SIEMPRE visible en móviles */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[999] bg-amber-600 text-white p-2 rounded-full shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* ✅ Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#3b2b20] border-r border-[#7a563e] p-6 shadow-xl z-[998]
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Botón cerrar menú móvil */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-amber-400 mb-10">
          🐾 Veterinaria
        </h2>

        <nav className="space-y-7">
          <a href="/dashboard" className="flex items-center gap-2 text-white hover:text-amber-300"><Home size={19}/> Dashboard</a>
          <a href="/owners" className="flex items-center gap-2 text-white hover:text-amber-300"><Users size={19}/> Propietarios</a>
          <a href="/patients" className="flex items-center gap-2 text-white hover:text-amber-300"><Dog size={19}/> Pacientes</a>
          <a href="/profile" className="flex items-center gap-2 text-white hover:text-amber-300"><Settings size={19}/> Perfil</a>
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-6 left-6 flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
        >
          <LogOut size={19}/> Cerrar Sesión
        </button>
      </div>
    </>
  );
}
