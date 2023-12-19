import io from "socket.io-client";
let socket;

const connectToSocket = (roomId) => {
  socket = io("https://1872-196-43-236-5.ngrok-free.app"); // Replace with your server URL

  socket.on('connect', () => {
    console.log('connected to socket server');
    socket.emit('joinRoom', roomId);
  });

  socket.on('newMessage', (newMessage) => {
    // Handle the new message
    // This could be adding the message to your state, triggering a re-render
    setMessages(prevMessages => [...prevMessages, newMessage]);
  });

  socket.on('disconnect', () => {
    console.log('disconnected from socket server');
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
