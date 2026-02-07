'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Evitar entrar si ya está logueado
  useEffect(() => {
    const token = authService.getToken();
    if (token) router.replace("/dashboard");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(email, password);
      router.replace("/dashboard"); // ✅ redirección segura
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3a4d2c] bg-gradient-to-br from-emerald-900 via-green-900 to-lime-800 text-white px-4">
      <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-700/40 overflow-hidden w-full max-w-4xl">

        {/* 🐶 Imagen temática */}
        <div className="hidden md:flex w-1/2 bg-[url('https://cdn.pixabay.com/photo/2017/02/20/18/03/dog-2083492_1280.jpg')] bg-cover bg-center grayscale-[20%] brightness-90"></div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-center text-3xl font-bold mb-2 text-amber-300 drop-shadow">
            🐾 Veterinaria Rural
          </h2>
          <p className="text-center text-sm text-gray-200 mb-6">
            Cuidado con corazón y tradición 🐕🐴🐄
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-700/60 border border-red-500 rounded-md text-red-100 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-200">Correo</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md bg-green-950/70 border border-green-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-200">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-green-950/70 border border-green-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md shadow-xl disabled:opacity-60 transition-all"
            >
              {isLoading ? "Entrando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
