/**
 * Modelo Appointment
 * @description Maneja todas las consultas SQL de citas
 */

const { pool } = require('../config/database');


class Appointment {
  /**
   * Crear nueva cita
   */
  static async create(data) {
    const { patient_id, owner_id, fecha, hora, motivo } = data;

    const [result] = await pool.execute(
      `INSERT INTO appointments 
        (patient_id, owner_id, fecha, hora, motivo)
       VALUES (?, ?, ?, ?, ?)`,
      [patient_id, owner_id, fecha, hora, motivo || null]
    );

    return this.findById(result.insertId);
  }

  /**
   * Buscar por ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT 
          a.*,
          p.name AS paciente_nombre,
          o.name AS propietario_nombre
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN owners o ON a.owner_id = o.id
       WHERE a.id = ?`,
      [id]
    );

    return rows[0];
  }

  /**
   * Obtener citas por fecha
   */
  static async findByDate(fecha) {
    const [rows] = await pool.execute(
      `SELECT 
     a.*,
     p.name AS paciente_nombre,
     o.name AS propietario_nombre
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN owners o ON a.owner_id = o.id
    WHERE a.fecha = ?
    ORDER BY a.hora ASC`,
      [fecha]
    );

    return rows;
  }

  /**
   * Verificar si el slot ya está ocupado
   */
  static async existsSlot(fecha, hora) {
    const [rows] = await pool.execute(
      `SELECT id FROM appointments
       WHERE fecha = ? AND hora = ?
       LIMIT 1`,
      [fecha, hora]
    );

    return rows.length > 0;
  }

  /**
   * Eliminar cita
   */
  static async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM appointments WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Appointment;
