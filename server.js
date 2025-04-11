const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const users = {}; // Mappa per memorizzare gli utenti e i loro nomi

io.on('connection', (socket) => {
    console.log('Un utente si è connesso');

    socket.on('set username', (username) => {
        users[socket.id] = username;
        io.emit('user connected', {
            username: username,
            online: true
        }); // Invia l'evento 'user connected' a tutti i client
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', {
            username: users[socket.id],
            message: msg
        });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            io.emit('user disconnected', {
                username: username,
                online: false
            }); // Invia l'evento 'user disconnected' a tutti i client
            console.log(`Utente ${username} disconnesso`);
            delete users[socket.id];
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000');
});