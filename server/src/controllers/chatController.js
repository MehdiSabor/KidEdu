// controllers/messageController.js

const messageService = require('../services/chatService');

exports.postMessage = async (req, res) => {
    const { roomId } = req.params;
  const { text } = req.body;
 // Check for a parent or child ID
  const parentId = req.user; // Assuming parentId is part of the user object
  const childIdFromHeader = req.headers['x-child-id']; // Child ID from the request header
  console.log(parentId,childIdFromHeader);
  // Determine sender type and sender ID based on the available information
  let senderType;
  let senderId;

  if (parentId) {
    senderType = 'parent';
    senderId = parentId;
  } else if (childIdFromHeader) {
    senderType = 'child';
    senderId = parseInt(childIdFromHeader); // Ensure the child ID is an integer
  } else {
    // Handle the error case where neither ID is present
    return res.status(400).json({ message: "Sender identification failed. Neither parent nor child ID provided." });
  }

  try {
    const message = await messageService.createMessage(text, roomId, senderId, senderType);
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message",  error: {
        name: error.name,
        message: error.message,
      } });
  }
};

exports.getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  
  try {
    const messages = await messageService.getMessagesByRoom(roomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error: {
        name: error.name,
        message: error.message,
      } });
  }
};
