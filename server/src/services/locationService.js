class LocationService {
    constructor(io) {
      this.io = io;
      this.activeRooms = {}; // Tracks which rooms are currently being watched
    }
  
    startTracking(roomId, parentSocketId) {
      // Add the parent to the room to receive location updates
      this.io.to(parentSocketId).join(roomId);
      this.activeRooms[roomId] = parentSocketId;
    }
  
    updateLocation(roomId, childLocation) {
      // Emit the location to the parent in the room
      this.io.to(this.activeRooms[roomId]).emit('locationUpdate', childLocation);
    }
  
    stopTracking(roomId) {
      // Stop sending updates and remove the parent from the room
      const parentSocketId = this.activeRooms[roomId];
      if (parentSocketId) {
        this.io.to(parentSocketId).leave(roomId);
        delete this.activeRooms[roomId];
      }
    }
  }
  
  module.exports = LocationService;
  