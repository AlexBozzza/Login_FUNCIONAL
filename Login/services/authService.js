const API_URL = "http://localhost:3001/api/v1/auth";

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // Guardar token y usuario
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      this.clearAuthData();
    }
  },

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return typeof window !== "undefined" && !!localStorage.getItem("token");
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  /** ✅ OBTENER PERFIL POR ID */
  async getProfile(id) {
    const token = this.getToken();
    
    const response = await fetch(`${API_URL}/profile?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data.data;
  },

  /** ✅ ACTUALIZAR PERFIL */
async updateProfile(data) {
  try {
    const token = this.getToken();

    const response = await fetch("http://localhost:3001/api/v1/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Error en updateProfile:", error);
    throw error;
  }
}
};
