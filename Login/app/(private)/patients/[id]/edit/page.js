"use client";

import { useEffect, useState } from "react";
import { patientsService } from "@/services/patientsService";
import { useRouter, useParams } from "next/navigation";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [patient, setPatient] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    medical_history: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await patientsService.getPatientById(id); // ✅ corregido
      setPatient(data);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await patientsService.updatePatient(id, patient);
    alert("✅ Paciente actualizado correctamente");
    router.push("/patients");
  };

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Editar Paciente</h1>

      <form onSubmit={handleSubmit} className="max-w-lg bg-[#4a382b] p-6 rounded-lg">

        <label className="text-white">Nombre</label>
        <input className="w-full p-2 mb-3 rounded" name="name" value={patient.name} onChange={handleChange} />

        <label className="text-white">Especie</label>
        <input className="w-full p-2 mb-3 rounded" name="species" value={patient.species} onChange={handleChange} />

        <label className="text-white">Raza</label>
        <input className="w-full p-2 mb-3 rounded" name="breed" value={patient.breed} onChange={handleChange} />

        <label className="text-white">Edad</label>
        <input type="number" className="w-full p-2 mb-3 rounded" name="age" value={patient.age} onChange={handleChange} />

        <label className="text-white">Historial Médico</label>
        <textarea className="w-full p-2 mb-3 rounded" name="medical_history" value={patient.medical_history} onChange={handleChange} />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar Cambios
        </button>
        <button
  type="button"
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-3"
  onClick={async () => {
    if (confirm("⚠️ ¿Seguro que deseas eliminar este paciente? Esta acción no se puede deshacer.")) {
      await patientsService.deletePatient(id);
      alert("✅ Paciente eliminado");
      router.push("/patients");
    }
  }}
>
  Eliminar Paciente
</button>

      </form>
    </div>
  );
}
