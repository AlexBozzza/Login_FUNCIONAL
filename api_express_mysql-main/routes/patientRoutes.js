const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// Obtener todos los pacientes
router.get("/", async (req, res) => {
  const data = await Patient.getAll();
  res.json({ data });
});

// Obtener paciente por ID ✅
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await Patient.findById(id);
  res.json({ data });
});

// Crear paciente
router.post("/", async (req, res) => {
  const data = await Patient.create(req.body);
  res.json({ data });
});

// Eliminar paciente por ID ✅
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Patient.delete(id);
  res.json({ success: true, message: "Paciente eliminado" });
});


// ✅ Actualizar paciente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Patient.update(id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating patient", err);
    res.status(500).json({ success: false, error: "Error updating patient" });
  }
});

// Eliminar paciente por ID ✅
 
  deletePatient: async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  }

module.exports = router;
