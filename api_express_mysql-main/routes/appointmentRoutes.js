/**
 * Rutas de Citas
 */

const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

/**
 * GET /appointments?fecha=YYYY-MM-DD
 */
router.get('/', AppointmentController.getByDate);

/**
 * POST /appointments
 */
router.post('/', AppointmentController.createAppointment);

module.exports = router;
