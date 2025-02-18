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
  console.log('a user connected');

  // Listen for the send-message event
  socket.on('send-message', (data) => {
    const { username, message } = data;

    // Log the message and username
    console.log(`User ${username} sent this message: ${message}`);

    // Broadcast the formatted message to all users
    io.emit('receive-message', { username, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});