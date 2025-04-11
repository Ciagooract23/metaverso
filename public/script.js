const popupContainer = document.getElementById('popup-container');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let username = '';
const socket = io(https://metaverso-fhfn.onrender.com);

// Aggiunto event listener per il tasto Invio nel campo usernameInput
usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        loginButton.click();
    }
});

loginButton.addEventListener('click', () => {
    username = usernameInput.value;
    if (username.trim() !== '') {
        socket.emit('set username', username);
        popupContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
    }
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

socket.on('chat message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', data.username === username ? 'sent' : 'received');
    messageDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user connected', (data) => {
    const statusDiv = document.createElement('div');
    statusDiv.textContent = `${data.username} è online`;
    messagesDiv.appendChild(statusDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user disconnected', (data) => {
    const statusDiv = document.createElement('div');
    statusDiv.textContent = `${data.username} è offline`;
    messagesDiv.appendChild(statusDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});