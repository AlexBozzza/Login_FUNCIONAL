/**
 * Controlador de Citas
 */

const Appointment = require('../models/Appointment');

class AppointmentController {
  /**
   * Crear cita
   */
  static async createAppointment(req, res) {
    try {
      console.log('📥 BODY RECIBIDO:', req.body);

      const { patient_id, owner_id, fecha, hora, motivo } = req.body;

      // 🔹 Validaciones básicas
      if (!patient_id || !owner_id || !fecha || !hora) {
        console.log('❌ Datos incompletos');
        return res.status(400).json({
          success: false,
          message: 'Datos incompletos',
        });
      }

      // 🔹 validar horario 9:00 a 17:30
      if (!AppointmentController.isValidHour(hora)) {
        console.log('❌ Hora inválida:', hora);
        return res.status(400).json({
          success: false,
          message: 'Hora fuera de horario permitido (9:00–17:30)',
        });
      }

      // 🔹 verificar slot ocupado
      const exists = await Appointment.existsSlot(fecha, hora);
      console.log('🕒 Slot ocupado?', exists);

      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'Este horario ya está ocupado',
        });
      }

      const newAppointment = await Appointment.create({
        patient_id,
        owner_id,
        fecha,
        hora,
        motivo,
      });

      console.log('✅ CITA CREADA');

      res.status(201).json({
        success: true,
        message: 'Cita creada correctamente',
        data: newAppointment,
      });
    } catch (error) {
      console.error('💥 Error en createAppointment:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Obtener citas por fecha
   */
  static async getByDate(req, res) {
    try {
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar la fecha',
        });
      }

      const appointments = await Appointment.findByDate(fecha);

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error('Error en getByDate:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * Validar hora en intervalos de 30 min
   */
  static isValidHour(hora) {
    const [h, m] = hora.split(':').map(Number);

    const minutes = h * 60 + m;
    const start = 9 * 60;      // 09:00
    const end = 17 * 60 + 30;  // 17:30

    if (minutes < start || minutes > end) return false;
    if (m !== 0 && m !== 30) return false;

    return true;
  }
}

module.exports = AppointmentController;