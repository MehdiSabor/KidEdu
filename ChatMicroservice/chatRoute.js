// routes/chatRoutes.js

const express = require('express');
const messageController = require('./chatController');
const router = express.Router();





// Endpoint to post a new message

  
  // Using the combined middleware in your route
  router.post('/send/:roomId', messageController.postMessage);
  
// Endpoint to get all messages for a room
router.get('/get/:roomId', messageController.getRoomMessages);

module.exports = router;

