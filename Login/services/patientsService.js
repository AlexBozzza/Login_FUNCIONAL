const API_URL = "http://localhost:3001/api/v1";

export const patientsService = {
  async getAllPatients() {
    const res = await fetch(`${API_URL}/patients`);
    const json = await res.json();
    return json.data;
  },

  async getPatientById(id) {
    const res = await fetch(`${API_URL}/patients/${id}`);
    const json = await res.json();
    return json.data;
  },

  async updatePatient(id, data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async createPatient(data) {
    const res = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error creando paciente");
    return (await res.json()).data;
  },

  // 👇🏻 AQUÍ AHORA SÍ VA LA COMA ANTES
  async deletePatient(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  },
};
