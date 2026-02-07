"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

export default function ProfilePage() {
  const [form, setForm] = useState({ id: "", nombre: "", email: "", telefono: "" });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setForm(user);
    else window.location.href = "/login";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await authService.updateProfile(form);
    if (res.success) alert("✅ Perfil actualizado");
    else alert("❌ Error al actualizar");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3b2a1d] p-6">
      <div className="bg-[#4a382b] p-8 rounded-xl shadow-2xl border border-[#8e6a4a] max-w-md w-full">

        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-[#6B4F37] rounded-full flex items-center justify-center border-4 border-[#8e6a4a] shadow-md text-white text-3xl font-bold">
            {form.nombre ? form.nombre.charAt(0).toUpperCase() : "U"}
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">Mi Perfil</h1>
          <p className="text-amber-300 text-sm">Administra tu información personal</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <label className="block text-white mb-1 font-semibold">Nombre</label>
          <input
            className="w-full p-2 rounded mb-4 bg-[#6B4F37] border border-[#8e6a4a] text-white focus:ring-2 focus:ring-amber-500"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <label className="block text-white mb-1 font-semibold">Email</label>
          <input
            className="w-full p-2 rounded mb-4 bg-gray-600 text-gray-300 cursor-not-allowed border border-[#8e6a4a]"
            value={form.email}
            disabled
          />

          <label className="block text-white mb-1 font-semibold">Teléfono</label>
          <input
            className="w-full p-2 rounded mb-6 bg-[#6B4F37] border border-[#8e6a4a] text-white focus:ring-2 focus:ring-amber-500"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <button
            className="w-full bg-amber-600 py-3 rounded-lg font-bold text-white hover:bg-amber-700 transition shadow-md"
          >
            Guardar Cambios
          </button>

        </form>
      </div>
    </div>
  );
}
