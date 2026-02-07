'use client';

import { useState } from "react";
import { ownersService } from "@/services/ownersService";
import { useRouter } from "next/navigation";

export default function NewOwnerPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await ownersService.createOwner(form);
      alert("✅ Propietario registrado correctamente");
      router.push("/owners");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar propietario");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-[#8e6a4a] mb-6 flex items-center gap-2">
        🐾 Registrar Propietario
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#4b3b29]/80 p-6 rounded-xl border border-[#8e6a4a] shadow-lg space-y-4"
      >
        <input
          name="name"
          placeholder="Nombre completo"
          className="w-full p-3 rounded bg-[#2d2419] border border-[#8e6a4a] placeholder-gray-400"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 rounded bg-[#2d2419] border border-[#8e6a4a] placeholder-gray-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Teléfono"
          className="w-full p-3 rounded bg-[#2d2419] border border-[#8e6a4a] placeholder-gray-400"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Dirección"
          className="w-full p-3 rounded bg-[#2d2419] border border-[#8e6a4a] placeholder-gray-400"
          value={form.address}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#8e6a4a] hover:bg-[#6d5037] text-white font-bold rounded-lg transition"
        >
          Guardar 🐶
        </button>
      </form>
    </div>
  );
}
