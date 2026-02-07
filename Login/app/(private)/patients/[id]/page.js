'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { patientsService } from "@/services/patientsService";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientsService.getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error("Error cargando paciente:", error);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) return <p className="text-white p-6">Cargando ficha médica...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-[#3b2a1d] text-white p-8 mt-6 rounded-lg border border-[#8e6a4a] shadow-lg">

      <h1 className="text-3xl font-bold mb-4 text-amber-400">{patient.name}</h1>

      <p><strong>Especie:</strong> {patient.species}</p>
      <p><strong>Raza:</strong> {patient.breed}</p>
      <p><strong>Edad:</strong> {patient.age}</p>
      <p><strong>Dueño:</strong> {patient.ownerName}</p>

      <h2 className="text-xl font-semibold mt-5">Historial Médico</h2>
      <p className="bg-[#2a1d14] p-3 rounded mt-2 border border-[#8e6a4a]">
        {patient.medical_history || "Sin historial registrado"}
      </p>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
        >
          Volver
        </button>

      <button
  onClick={() => window.location.href = `/patients/${patient.id}/edit`}
  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  Editar paciente
</button>

      </div>

    </div>
  );
}
