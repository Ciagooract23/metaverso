const socket = io();
const username = prompt("Inserisci il tuo nome utente:");

// Funzione di invio messaggio
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value;

  if (message.trim()) {
    socket.emit('chat message', { username, message });
    messageInput.value = '';
  }
}

// Invia con il pulsante
document.getElementById('send-button').addEventListener('click', () => {
  sendMessage();
});

// Invia con invio da tastiera
document.getElementById('message-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Ricezione messaggi
socket.on('chat message', (data) => {
  const newMessage = document.createElement('div');
  newMessage.classList.add('message');

  const userNameElement = document.createElement('strong');
  userNameElement.textContent = data.username + ': ';
  newMessage.appendChild(userNameElement);

  const messageText = document.createElement('span');
  messageText.textContent = data.message;
  newMessage.appendChild(messageText);

  if (data.username === username) {
    newMessage.classList.add('sent');
  } else {
    newMessage.classList.add('received');
  }

  document.getElementById('chat-box').appendChild(newMessage);
  document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
});
