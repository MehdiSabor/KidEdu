const LocationService = require('../services/locationService');

class LocationController {
  constructor(io) {
    this.locationService = new LocationService(io);
  }


  getLocation(req, res) {
    const roomId = req.params.roomId;
    const parentSocketId = req.user; 

    this.locationService.startTracking(roomId, parentSocketId);
    res.status(200).send({ message: 'Tracking started.' });
  }
}

module.exports = LocationController;
