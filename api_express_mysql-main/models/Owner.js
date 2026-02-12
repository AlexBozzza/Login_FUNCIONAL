// models/Owner.js
const { pool } = require("../config/database");

const Owner = {
  async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM owners ORDER BY id DESC"
    );
    return rows;
  },

  // ✅ Alias para no romper el controller
  async getAll() {
    return await this.findAll();
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM owners WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, phone, address }) {
    const [result] = await pool.execute(
      "INSERT INTO owners (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address]
    );

    return { insertId: result.insertId };
  },

  // ✅ Editar propietario
  async update(id, { name, email, phone, address }) {
    await pool.execute(
      "UPDATE owners SET name=?, email=?, phone=?, address=? WHERE id=?",
      [name, email, phone, address, id]
    );

    return true;
  },

  // ✅ ELIMINAR PROPIETARIO (🔥 LO QUE FALTABA)
  async delete(id) {
    await pool.execute(
      "DELETE FROM owners WHERE id = ?",
      [id]
    );
    return true;
  },
};

module.exports = Owner;
