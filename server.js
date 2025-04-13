const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('new user', (nickname) => {
    users[socket.id] = nickname;
    io.emit('user list', Object.values(users));
  });

  socket.on('chat message', (msg) => {
    const sender = users[socket.id];
    io.emit('chat message', { msg, sender });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

server.listen(3000, () => {
  console.log('BackRoom è online su http://localhost:3000');
});
