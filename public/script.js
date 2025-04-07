const socket = io();
let userName = '';
let messagesContainer = document.getElementById('messages');
let messageInput = document.getElementById('messageInput');
let userList = document.getElementById('userList');

// Funzione per entrare nella chat
function joinChat() {
  userName = document.getElementById('userName').value.trim();
  if (userName) {
    socket.emit('newUser', userName);
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
  } else {
    alert('Per favore, inserisci un nome valido');
  }
}

// Aggiungi un listener per il tasto "Enter" nel campo del nome utente
document.getElementById('userName').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {  // "Enter" premuto
    joinChat();
  }
});

// Funzione per inviare un messaggio
function sendMessage() {
  let message = messageInput.value.trim();
  if (message) {
    socket.emit('sendMessage', message);
    messageInput.value = '';
  }
}

// Aggiungi un listener per il tasto "Enter" (invio) sulla tastiera per i messaggi
messageInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {  // "Enter" senza "Shift"
    sendMessage();
    event.preventDefault();  // Evita che il "Enter" vada a capo
  }
});

// Gestisci la visualizzazione dei messaggi
socket.on('message', (data) => {
  // Evita che venga visualizzato "undefined: undefined"
  if (data && data.userName && data.message) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    if (data.userName === userName) {
      messageElement.classList.add('sent');
    } else {
      messageElement.classList.add('received');
    }

    messageElement.textContent = `${data.userName}: ${data.message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});

// Gestisci l'elenco degli utenti online
socket.on('userList', (users) => {
  userList.innerHTML = `Utenti online: ${users.join(', ')}`;
});
