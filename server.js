const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('new-user', username => {
    users[socket.id] = username;
    io.emit('user-list', Object.values(users));
    socket.broadcast.emit('chat-message', {
      text: `${username} è entrato nella chat`,
      type: 'system'
    });
  });

  socket.on('send-message', data => {
    socket.broadcast.emit('chat-message', {
      text: data.text,
      sender: users[socket.id],
      type: 'received'
    });

    // Mostra anche il messaggio all'utente mittente
    socket.emit('chat-message', {
      text: data.text,
      sender: 'Tu',
      type: 'sent'
    });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
    if (username) {
      socket.broadcast.emit('chat-message', {
        text: `${username} ha lasciato la chat`,
        type: 'system'
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server su http://localhost:${PORT}`);
});
