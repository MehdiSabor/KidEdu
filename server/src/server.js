const express = require('express');
const parentRoutes = require('./routes/parentRoute');
const authRoutes = require('./routes/authRoute');
const roomRoutes = require('./routes/roomRoute');
const taskRoutes = require('./routes/taskRoute');
const rewardRoutes = require('./routes/rewardRoute');
const childRoutes = require('./routes/childRoute');
const chatRoutes = require('./routes/chatRoute');
const locationRoutes = require('./routes/locationRoute');
const passport = require('passport');
require('./config/passport'); // Import passport configuration
const socketIo = require('./socket');

const http = require('http');



const app = express();
const PORT = 3000;






app.use(passport.initialize());
app.use(express.json()); // for parsing application/json



const server = http.createServer(app);
 // Adjust the path as necessary
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



app.use('/auth', authRoutes );
app.use('/parent', parentRoutes );
app.use('/room', roomRoutes );
app.use('/task', taskRoutes);
app.use('/reward', rewardRoutes);
app.use('/child', childRoutes);
app.use('/chat',chatRoutes);
app.use('/location',locationRoutes);


// ... integrate other routes



server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = { app, server, io };