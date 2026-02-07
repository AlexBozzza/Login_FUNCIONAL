"use client";

import { useEffect, useState } from "react";
import { authService } from "../../../services/authService";
import { PawPrint, Users, Dog, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserName(user.nombre || user.email);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#3b2a1d] flex flex-col items-center p-10">

      {/* Botón logout arriba */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#6B4F37] border border-[#8e6a4a] rounded-lg text-white hover:bg-[#5a412e]"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white">Panel Veterinario</h1>
      <p className="text-amber-300 font-medium mb-6">
        Bienvenido, {userName} 👋
      </p>

      <div className="mb-10">
        <div className="mx-auto w-20 h-20 bg-[#6B4F37] rounded-full flex items-center justify-center border-4 border-[#8e6a4a]">
          <PawPrint size={50} className="text-white" />
        </div>
        <h2 className="text-4xl text-white font-bold mt-4">
          Clínica Veterinaria Rústica
        </h2>
        <p className="text-gray-300 italic">
          “Cuidando tus animales como familia”
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

        <a href="/owners" className="p-6 bg-[#6B4F37]/90 rounded-xl border border-[#8e6a4a] hover:bg-[#5a412e] transition shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#8e6a4a] rounded-lg flex items-center justify-center">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Propietarios</h3>
              <p className="text-sm text-gray-100">Administrar dueños</p>
            </div>
          </div>
        </a>

        <a href="/patients" className="p-6 bg-[#6B4F37]/90 rounded-xl border border-[#8e6a4a] hover:bg-[#5a412e] transition shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#8e6a4a] rounded-lg flex items-center justify-center">
              <Dog size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pacientes</h3>
              <p className="text-sm text-gray-100">Gestionar mascotas</p>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}
