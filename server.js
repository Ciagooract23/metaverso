const express = require('express');
const path = require('path');

const app = express();

// Definisce la cartella 'public' per i file statici
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback: serve sempre public/index.html sulla rotta root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

io.on('connection', socket => {
  // Memorizza nickname al join
  socket.on('join', nickname => {
    socket.nickname = nickname;
  });

  // Broadcast dei messaggi agli altri client
  socket.on('message', msg => {
    socket.broadcast.emit('message', msg);
  });

  // Indicatore 'sta scrivendo'
  socket.on('typing', () => socket.broadcast.emit('typing'));
  socket.on('stopTyping', () => socket.broadcast.emit('stopTyping'));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server ascolta su ${PORT}`));
