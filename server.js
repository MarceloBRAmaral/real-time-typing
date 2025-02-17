const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
  // Get the user's IP address
  const userIp = socket.handshake.address;
  console.log(`A user connected with IP: ${userIp}`);

  // Listen for typing events
  socket.on('typing', (data) => {
    // Broadcast the typing data to all other users
    socket.broadcast.emit('typing', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User with IP ${userIp} disconnected`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});