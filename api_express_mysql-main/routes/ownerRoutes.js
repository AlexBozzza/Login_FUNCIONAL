const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");

// GET /owners -> lista de propietarios
router.get("/", async (req, res) => {
  try {
    const owners = await Owner.findAll();
    return res.status(200).json({ success: true, data: owners });
  } catch (err) {
    console.error("GET /owners error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error obteniendo propietarios" });
  }
});

// ✅ NUEVO — GET /owners/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await Owner.findById(id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (err) {
    console.error("GET /owners/:id error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error obteniendo propietario" });
  }
});

// POST /owners -> crear propietario
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Nombre y correo son obligatorios" });
    }

    const created = await Owner.create({
      name,
      email,
      phone: phone || null,
      address: address || null,
    });

    let owner = created;
    if (created && created.insertId && typeof Owner.findById === "function") {
      owner = await Owner.findById(created.insertId);
    }

    return res.status(201).json({ success: true, data: owner });
  } catch (err) {
    console.error("POST /owners error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error creando propietario" });
  }
});

// Eliminar propietario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Owner.delete(id);

    res.json({
      success: true,
      message: 'Propietario eliminado correctamente',
    });
  } catch (error) {
    console.error('Error eliminando propietario:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando propietario',
    });
  }
});


// PUT /owners/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    await Owner.update(id, { name, email, phone, address });

    return res.json({
      success: true,
      message: "Propietario actualizado",
    });
  } catch (err) {
    console.error("PUT /owners/:id error:", err);
    return res.status(500).json({
      success: false,
      message: "Error actualizando propietario",
    });
  }
});


module.exports = router;
