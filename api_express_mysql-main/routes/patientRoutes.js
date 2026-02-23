const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// ✅ Obtener pacientes (con filtro opcional por owner)
router.get("/", async (req, res) => {
  try {
    const { owner_id } = req.query;

    let data;

    if (owner_id) {
      data = await Patient.getByOwnerId(owner_id);
    } else {
      data = await Patient.getAll();
    }

    res.json({ data });
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    res.status(500).json({ message: "Error obteniendo pacientes" });
  }
});

// ✅ Obtener paciente por ID (ESTA ERA LA QUE FALTABA)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Patient.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error obteniendo paciente por ID:", error);
    res.status(500).json({ message: "Error obteniendo paciente" });
  }
});

// Crear paciente
router.post("/", async (req, res) => {
  const data = await Patient.create(req.body);
  res.json({ data });
});

// Eliminar paciente por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Patient.delete(id);
  res.json({ success: true, message: "Paciente eliminado" });
});

// Actualizar paciente
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

module.exports = router;