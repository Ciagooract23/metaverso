const socket = io();
let username = '';

while (!username) {
  username = prompt("Inserisci il tuo nome utente:");
}
socket.emit('new-user', username);

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usersList = document.getElementById('users');
const typingIndicator = document.getElementById('typing-indicator');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (input.value) {
    appendMessage(input.value, 'sent');
    socket.emit('send-message', input.value);
    input.value = '';
  }
});

input.addEventListener('input', () => {
  socket.emit('typing');
});

socket.on('chat-message', data => {
  if (data.sender === 'system') {
    appendSystemMessage(data.message);
  } else {
    appendMessage(`${data.sender}: ${data.message}`, 'received');
  }
});

socket.on('user-list', users => {
  usersList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
});

socket.on('typing', user => {
  typingIndicator.textContent = `${user} sta scrivendo...`;
  setTimeout(() => typingIndicator.textContent = '', 2000);
});

function appendMessage(msg, type) {
  const div = document.createElement('div');
  div.classList.add('message', type);
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function appendSystemMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message', 'system');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
