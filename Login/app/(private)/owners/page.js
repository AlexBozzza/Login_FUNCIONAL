"use client";

import { useEffect, useState } from "react";
import { ownersService } from "../../../services/ownersService";
import { User, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      const res = await ownersService.getOwners();
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setOwners(list.map(o => ({ ...o, open: false })));
    } catch (error) {
      console.error("❌ Error obteniendo propietarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const toggleRow = (idx) => {
    setOwners(prev =>
      prev.map((o, i) => (i === idx ? { ...o, open: !o.open } : o))
    );
  };

  return (
    <div className="w-full p-8">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <User size={32} /> Propietarios
        </h1>

        <a
          href="/owners/new"
          className="flex items-center gap-2 bg-amber-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-amber-700 transition"
        >
          <PlusCircle size={20} />
          Nuevo Propietario
        </a>
      </div>

      {/* Tabla */}
      <div className="bg-[#4a382b] rounded-lg shadow-xl border border-[#8e6a4a] overflow-hidden">
        {loading ? (
          <p className="text-white text-center py-6">Cargando...</p>
        ) : owners.length === 0 ? (
          <p className="text-gray-200 text-center py-6">
            No hay propietarios registrados.
          </p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="text-left bg-[#6B4F37]">
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 w-12 text-right pr-6">Ver</th>
              </tr>
            </thead>

            <tbody>
              {owners.map((owner, idx) => (
                <tr key={owner.id} className="border-b border-[#8e6a4a]">
                  <td onClick={() => toggleRow(idx)} className="p-3 cursor-pointer hover:bg-[#5c4430]/60">
                    {owner.name}
                  </td>
                  <td onClick={() => toggleRow(idx)} className="p-3 cursor-pointer hover:bg-[#5c4430]/60">
                    {owner.email}
                  </td>
                  <td onClick={() => toggleRow(idx)} className="p-3 cursor-pointer hover:bg-[#5c4430]/60">
                    {owner.phone}
                  </td>

                  <td className="p-3 text-right pr-6">
                    <button
                      onClick={() => toggleRow(idx)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#6B4F37] hover:bg-[#5a412e] border border-[#8e6a4a] transition"
                    >
                      {owner.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </td>

                  {owner.open && (
                    <td colSpan={4} className="p-0">
                      <div className="px-4 py-4 bg-[#3b2b20]/80 text-sm text-gray-200">
                        <span className="font-bold text-amber-400">Dirección: </span>
                        {owner.address || "No registrada"}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
