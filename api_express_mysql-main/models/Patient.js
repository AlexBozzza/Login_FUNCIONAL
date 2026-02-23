const { pool } = require("../config/database");

const Patient = {
  // ✅ Crear paciente
  async create(data) {
    const { name, species, breed, age, medical_history, owner_id } = data;

    const [result] = await pool.query(
      `INSERT INTO patients 
       (name, species, breed, age, medical_history, owner_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, species, breed, age, medical_history, owner_id]
    );

    return this.findById(result.insertId);
  },

  // ✅ Obtener todos (DESDE LA VISTA)
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM vista_pacientes ORDER BY id DESC`
    );
    return rows;
  },

  // 🔥 NUEVO — Obtener por owner (EL FIX IMPORTANTE)
  async getByOwnerId(ownerId) {
    const [rows] = await pool.query(
      `SELECT * 
       FROM vista_pacientes 
       WHERE owner_id = ?
       ORDER BY id DESC`,
      [ownerId]
    );
    return rows;
  },

  // ✅ Obtener por ID
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.species,
        p.breed,
        p.age,
        p.medical_history,
        p.owner_id,
        o.name AS owner_name
      FROM patients p
      LEFT JOIN owners o ON p.owner_id = o.id
      WHERE p.id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  // ✅ Actualizar paciente
  async update(id, data) {
    const {
      name = null,
      species = null,
      breed = null,
      age = null,
      medical_history = null,
    } = data;

    await pool.query(
      `UPDATE patients
       SET 
         name = ?,
         species = ?,
         breed = ?,
         age = ?,
         medical_history = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [name, species, breed, age, medical_history, id]
    );

    const [rows] = await pool.query(
      `SELECT 
        p.*,
        o.name AS owner_name
       FROM patients p
       LEFT JOIN owners o ON p.owner_id = o.id
       WHERE p.id = ?`,
      [id]
    );

    return rows[0];
  },

  // ✅ Eliminar paciente
  async delete(id) {
    await pool.query(`DELETE FROM patients WHERE id = ?`, [id]);
    return true;
  },
};

module.exports = Patient;