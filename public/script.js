const socket = io();
let nickname = "";

function setNickname() {
  nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    document.getElementById('nicknamePopup').style.display = 'none';
    socket.emit('new user', nickname);
  }
}

const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const userList = document.getElementById('userList');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit('chat message', msg);
    displayMessage(msg, 'sent');
    messageInput.value = '';
  }
});

socket.on('chat message', ({ msg, sender }) => {
  if (sender !== nickname) {
    displayMessage(`${sender}: ${msg}`, 'received');
  }
});

socket.on('user list', (users) => {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    userList.appendChild(li);
  });
});

function displayMessage(msg, type) {
  const div = document.createElement('div');
  div.classList.add('message', type);
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
