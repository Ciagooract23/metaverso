const socket = io();
let username = "";

// Richiedi nome utente all'ingresso
while (!username) {
  username = prompt("Inserisci il tuo nome:");
}

socket.emit('new-user', username);

// Elementi DOM
const input = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const userList = document.getElementById('userList');

// Invio con bottone o INVIO
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Funzione per inviare messaggio
function sendMessage() {
  const text = input.value.trim();
  if (text) {
    socket.emit('send-message', { text });
    input.value = '';
  }
}

// Funzione scroll automatico in fondo
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// Ricezione messaggio
socket.on('chat-message', data => {
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.classList.add(data.type);

  if (data.type === 'system') {
    msg.classList.add('system');
    msg.textContent = data.text;
  } else {
    msg.innerHTML = `<strong>${data.sender}</strong><br>${data.text}`;
  }

  messages.appendChild(msg);
  scrollToBottom(); // scroll automatico quando arriva un nuovo messaggio
});

// Aggiornamento lista utenti online
socket.on('user-list', users => {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    userList.appendChild(li);
  });
});
