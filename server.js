const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

// Serve i file statici dalla cartella "public"
app.use(express.static('public'));

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('Utente connesso:', socket.id);

  // Registrazione del nuovo utente
  socket.on('new user', (username) => {
    socket.username = username;
    onlineUsers[socket.id] = username;
    io.emit('update users', Object.values(onlineUsers));
    console.log(`${username} è online`);
  });

  // Quando un utente sta scrivendo, invia l'evento a tutti gli utenti (incluso chi scrive)
  socket.on('typing', () => {
    io.emit('typing', socket.username);
  });

  // Quando il messaggio viene inviato
  socket.on('new message', (msg) => {
    io.emit('new message', {
      username: socket.username,
      message: msg
    });
    // Comunica a tutti di smettere di scrivere
    io.emit('stop typing', socket.username);
  });

  // Quando l'utente smette di scrivere
  socket.on('stop typing', () => {
    io.emit('stop typing', socket.username);
  });

  // Gestione della disconnessione
  socket.on('disconnect', () => {
    console.log('Utente disconnesso:', socket.id);
    if (socket.username) {
      delete onlineUsers[socket.id];
      io.emit('update users', Object.values(onlineUsers));
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
