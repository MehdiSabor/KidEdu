const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');
const authenticateJWT = require('../middleware/authenticateJWT');
const { io } = require('../server');

const locationController = new LocationController(io);

// Start location tracking for a room
router.get('/get/:roomId',authenticateJWT, (req, res) => {
  locationController.getLocation(req, res);
});

module.exports = router;
