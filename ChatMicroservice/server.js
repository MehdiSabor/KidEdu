
const express = require('express');
const chatRoutes = require('./chatRoute');
const socketIo = require('./socket');

const http = require('http');



const app = express();
const PORT = 3001;


app.use(express.json()); // for parsing application/json

const server = http.createServer(app);
const io = socketIo.init(server);
io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);
  
    socket.on('join-room', (roomId) => {
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
      // Perform any cleanup or status updates needed
    });
  });

  app.use('/chat',chatRoutes);


  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = { app, server, io };