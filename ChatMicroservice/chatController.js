// controllers/messageController.js

const messageService = require('./chatService');
const socketIo = require('./socket'); // Adjust the path as necessary

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);  

require('dotenv').config();

exports.postMessage = async (req, res) => {
    const { roomId } = req.params;
    console.log('test',roomId, req.params);
  const { text } = req.body;
 // Check for a parent or child ID

 

 // Assuming parentId is part of the user object
  const childIdFromHeader = req.headers['x-child-id']; // Child ID from the request header
  
  const io = socketIo.getIO();


let parentId;
 if (!childIdFromHeader) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = await verifyAsync(token, process.env.SECRET_KEY);
    parentId = decoded.parentId;
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
 } 
  if (!io) {
    throw new Error('Socket.io instance is undefined');
  }

  if (!roomId) {
    throw new Error('Room ID is undefined');
  }
  // Determine sender type and sender ID based on the available information
  let senderType;
  let senderId;

  if (parentId) {
    senderType = 'child';
    senderId = parentId;
  } else if (childIdFromHeader) {
    senderType = 'child';
    senderId = parseInt(childIdFromHeader); // Ensure the child ID is an integer
  } else {
    // Handle the error case where neither ID is present

    return res.status(400).json({ message: "Sender identification failed. Neither parent nor child ID provided." });
  }

  try {
    console.log(`Creating message in room ${roomId} by ${senderType} with ID ${senderId}`);
    const message = await messageService.createMessage(text, roomId, senderId, senderType);

    
    
    io.to(roomId).emit('new-message', message); // Emit to all clients in the room
    console.log(`Emitting message to room ${roomId}:`, message);
    
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
