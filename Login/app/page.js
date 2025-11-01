'use client';

import { useState, useEffect } from "react";
import { authService } from "../services/authService"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Verificar si ya está autenticado al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsLoggedIn(true);
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Intentando login con:", email);
      
      // Usar el servicio de autenticación
      const response = await authService.login(email, password);
      
      console.log("Login exitoso:", response);
      
      // Limpiar campos
      setEmail("");
      setPassword("");

      // Activar el dashboard
      setIsLoggedIn(true);
      
    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message || "Credenciales incorrectas");
      alert(error.message || "Error en el login");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión usando el servicio
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error en logout:", error);
      // Forzar limpieza local aunque falle el logout en servidor
      authService.clearAuthData();
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener información del usuario actual
  const getCurrentUserInfo = () => {
    const user = authService.getCurrentUser();
    return user ? user.email : localStorage.getItem('email');
  };

  // Si el usuario está logueado, mostramos el Dashboard
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-400 mb-2">Dashboard</h1>
            <p className="text-gray-300">
              Bienvenido, <span className="text-indigo-300 font-medium">{getCurrentUserInfo()}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="text-yellow-400 text-sm">Cerrando sesión...</div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido del dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900/70 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-500/20 transition">
            <h3 className="text-lg font-semibold text-indigo-400">Usuarios</h3>
            <p className="text-gray-400 mt-2 text-sm">Administrar cuentas registradas</p>
          </div>

          <div className="bg-gray-900/70 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-500/20 transition">
            <h3 className="text-lg font-semibold text-indigo-400">Estadísticas</h3>
            <p className="text-gray-400 mt-2 text-sm">Ver métricas del sistema</p>
          </div>

          <div className="bg-gray-900/70 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-500/20 transition">
            <h3 className="text-lg font-semibold text-indigo-400">Configuración</h3>
            <p className="text-gray-400 mt-2 text-sm">Ajustes y preferencias del usuario</p>
          </div>
        </div>

        {/* Información de autenticación (para debug) */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Información de autenticación:</h4>
          <p className="text-xs text-gray-500">
            Token: {authService.getToken() ? '✓ Presente' : '✗ No encontrado'}
          </p>
          <p className="text-xs text-gray-500">
            Usuario: {authService.getCurrentUser() ? '✓ Loggeado' : '✗ No loggeado'}
          </p>
        </div>
      </div>
    );
  }

  // Formulario de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-center text-3xl font-extrabold mb-2 text-indigo-400 drop-shadow-md">
          Bienvenido de nuevo
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Ingresa tus credenciales para acceder
        </p>

        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-500 border-gray-600 rounded focus:ring-indigo-400"
                disabled={isLoading}
              />
              <span className="text-gray-300">Recordarme</span>
            </label>

            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-2 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50 transition-transform hover:scale-[1.02] shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Regístrate aquí
            </a>
          </p>
        </form>

        {/* Información de debug */}
        <div className="mt-6 p-3 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            Estado: {isLoading ? "Cargando..." : "Listo"} | 
            Autenticado: {authService.isAuthenticated() ? "Sí" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}