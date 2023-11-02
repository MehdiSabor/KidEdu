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

const http = require('http');
const socketIo = require('socket.io');


const app = express();
const PORT = 3000;





app.use(passport.initialize());
app.use(express.json()); // for parsing application/json



const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', data.message);
    // Here you should also call the service to save the message to the database
  });

  // Listen for location updates from the child
  socket.on('childLocationUpdate', ({ roomId, coords }) => {
    // Here you should have authorization logic to verify the child
    new LocationService(io).updateLocation(roomId, coords);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
