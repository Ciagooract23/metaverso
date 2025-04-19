const socket = io();
let typingTimer;
const TYPING_DELAY = 500;

const chatArea = document.getElementById('chat-area');
const msgInput = document.getElementById('msg-input');
const sendBtn  = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

const nickname = prompt('Inserisci il tuo nickname:') || 'Anonimo';
socket.emit('join', nickname);

// Funzione per aggiungere bolla
function appendBubble(text, type) {
  const div = document.createElement('div');
  div.classList.add('bubble', type);
  div.textContent = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Invia messaggio
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  appendBubble(text, 'sent');
  socket.emit('message', { nickname, text });
  msgInput.value = '';
  socket.emit('stopTyping');
}

sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
  socket.emit('typing');
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => socket.emit('stopTyping'), TYPING_DELAY);
});

// Ricezione messaggi
socket.on('message', ({ nickname: user, text }) => {
  appendBubble(`${user}: ${text}`, 'received');
});

// Indicatore di scrittura
socket.on('typing', () => typingIndicator.classList.add('show'));
socket.on('stopTyping', () => typingIndicator.classList.remove('show'));
