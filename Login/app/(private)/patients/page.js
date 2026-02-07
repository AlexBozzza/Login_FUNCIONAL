'use client';

import { useEffect, useState } from "react";
import { patientsService } from "../../../services/patientsService"; // ✅ ruta correcta
import { Dog, PlusCircle, FileSearch } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await patientsService.getAllPatients();
        // Soporta respuesta como array o { data: [...] }
        setPatients(Array.isArray(data) ? data : (data?.data ?? []));
      } catch (error) {
        console.error("❌ Error obteniendo pacientes:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Dog size={32} /> Pacientes
        </h1>

        <a
          href="/patients/new"
          className="flex items-center gap-2 bg-amber-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-amber-700 transition"
        >
          <PlusCircle size={20} />
          Nuevo Paciente
        </a>
      </div>

      <div className="bg-[#4a382b] rounded-lg shadow-xl p-4 border border-[#8e6a4a] overflow-hidden">
        {loading ? (
          <p className="text-white text-center py-6">Cargando...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-200 text-center py-6">No hay pacientes registrados.</p>
        ) : (
          <table className="w-full text-white rounded-lg overflow-hidden">
            <thead>
              <tr className="text-left bg-[#6B4F37]">
                <th className="p-3">Nombre</th>
                <th className="p-3">Especie</th>
                <th className="p-3">Raza</th>
                <th className="p-3">Propietario</th>
                <th className="p-3 text-center">Ficha</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-[#8e6a4a] hover:bg-[#5c4430]/60 transition"
                >
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.species}</td>
                  <td className="p-3">{patient.breed}</td>
                  <td className="p-3">{patient.owner_name}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => (window.location.href = `/patients/${patient.id}`)}
                      className="inline-flex items-center justify-center w-9 h-9 bg-amber-600 hover:bg-amber-700 rounded-full transition shadow-md"
                      title="Ver ficha médica"
                    >
                      <FileSearch size={18} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
