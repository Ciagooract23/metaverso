const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve la favicon e altri file statici

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];

io.on('connection', (socket) => {
  let userName = '';
  
  // Gestisci quando un nuovo utente si connette
  socket.on('newUser', (name) => {
    userName = name;
    users.push(userName);
    io.emit('userList', users);
    io.emit('message', { userName: 'System', message: `${userName} è online` });
  });

  // Gestisci quando un utente invia un messaggio
  socket.on('sendMessage', (message) => {
    if (message.trim()) {
      io.emit('message', { userName, message });
    }
  });

  // Gestisci quando un utente si disconnette
  socket.on('disconnect', () => {
    users = users.filter(user => user !== userName);
    io.emit('userList', users);
    io.emit('message', { userName: 'System', message: `${userName} è offline` });
  });
});

server.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
