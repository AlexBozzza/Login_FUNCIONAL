const Owner = require("../models/Owner");

// ✅ LISTAR PROPIETARIOS
exports.getOwners = async (req, res) => {
  try {
    const rows = await Owner.getAll();
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener propietarios" });
  }
};

// ✅ OBTENER PROPIETARIO POR ID (NUEVO)
exports.getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await Owner.findById(id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        error: "Propietario no encontrado",
      });
    }

    res.json({
      success: true,
      data: owner,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener propietario" });
  }
};

// ✅ CREAR PROPIETARIO
exports.createOwner = async (req, res) => {
  try {
    await Owner.create(req.body);
    res.json({ message: "Propietario creado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error creando propietario" });
  }
};
