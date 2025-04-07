const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('new-user', username => {
    users[socket.id] = username;
    io.emit('user-list', Object.values(users));
    socket.broadcast.emit('chat-message', {
      message: `${username} si è unito alla chat.`,
      sender: 'system'
    });
  });

  socket.on('send-message', message => {
    socket.broadcast.emit('chat-message', {
      message,
      sender: users[socket.id]
    });
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', users[socket.id]);
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      socket.broadcast.emit('chat-message', {
        message: `${users[socket.id]} ha lasciato la chat.`,
        sender: 'system'
      });
      delete users[socket.id];
      io.emit('user-list', Object.values(users));
    }
  });
});

server.listen(3000, () => console.log('Server avviato su http://localhost:3000'));
