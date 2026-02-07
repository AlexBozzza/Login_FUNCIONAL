// services/ownersService.js
const API_URL = "http://localhost:3001/api/v1";

export const ownersService = {
  async createOwner(data) {
    const res = await fetch(`${API_URL}/owners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error creando propietario");

    const result = await res.json();
    return result.data;
  },

  async getOwners() {   // 👈 nombre debe coincidir con tu page.js
    const res = await fetch(`${API_URL}/owners`);
    if (!res.ok) throw new Error("Error obteniendo propietarios");

    const result = await res.json();
    return result.data || [];
  }
};
