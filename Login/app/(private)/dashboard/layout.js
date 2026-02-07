export default function PrivateLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#3a2e26]">
      {/* Sidebar Rústica */}
      <aside className="w-64 bg-[#4b382a] text-white p-6 hidden md:flex flex-col border-r border-[#8e6a4a] shadow-xl">
        <h2 className="text-2xl font-bold text-amber-300 mb-8 tracking-wide">
          🐾 Veterinaria
        </h2>

        <nav className="flex flex-col gap-4">
          <a href="/dashboard" className="hover:text-amber-300 transition">🏡 Dashboard</a>
          <a href="/owners" className="hover:text-amber-300 transition">👤 Propietarios</a>
          <a href="/patients" className="hover:text-amber-300 transition">🐶 Pacientes</a>
          <a href="/profile" className="hover:text-amber-300 transition">⚙️ Perfil</a>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
