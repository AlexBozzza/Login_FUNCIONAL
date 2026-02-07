'use client';

import { useState, useEffect } from "react";
import { patientsService } from "@/services/patientsService";
import { ownersService } from "@/services/ownersService";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
  const router = useRouter();
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    owner_id: "",
    name: "",
    species: "",
    breed: "",
    age: "",
    medical_history: ""
  });

  // ✅ Traer propietarios
  useEffect(() => {
    ownersService.getOwners()
      .then(setOwners)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await patientsService.createPatient(form);
      alert("✅ Paciente registrado exitosamente");
      router.push("/patients");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo registrar el paciente (posible duplicado o datos inválidos)");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-amber-400 mb-4">Registrar Paciente</h1>

      <form onSubmit={handleSubmit} className="bg-[#3b2a1d] p-6 rounded-lg space-y-4 max-w-md">

        <select
          name="owner_id"
          required
          className="w-full p-2 rounded bg-[#2a1d14] border border-[#8e6a4a]"
          onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
        >
          <option value="">Seleccione propietario</option>
          {owners.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>

        <input className="w-full p-2 rounded bg-[#2a1d14]" placeholder="Nombre mascota" required 
          onChange={(e)=>setForm({ ...form, name: e.target.value })} />

        <input className="w-full p-2 rounded bg-[#2a1d14]" placeholder="Especie"
          onChange={(e)=>setForm({ ...form, species: e.target.value })} />

        <input className="w-full p-2 rounded bg-[#2a1d14]" placeholder="Raza"
          onChange={(e)=>setForm({ ...form, breed: e.target.value })} />

        <input type="number" className="w-full p-2 rounded bg-[#2a1d14]" placeholder="Edad"
          onChange={(e)=>setForm({ ...form, age: e.target.value })} />

        <textarea className="w-full p-2 rounded bg-[#2a1d14]" placeholder="Historial médico"
          onChange={(e)=>setForm({ ...form, medical_history: e.target.value })} />

        <button className="w-full bg-amber-600 py-2 rounded hover:bg-amber-700">
          Guardar
        </button>
      </form>
    </div>
  );
}
