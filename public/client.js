const socket = io.connect();

socket.on('message', obj => {
  messageBox(obj)
})

const chatBox = document.querySelector('.message-box')
const myName = document.querySelector('.myName');
const newMessage = document.querySelector('.chat-message-box');
const chatScreen = document.querySelector('.right')
const sendBtn = document.querySelector('.chat-send');
const roomName = document.querySelector('.room-number');
const leaveBtn = document.querySelector('.leave-btn');
const userNames = document.querySelector('.chat-usernames')

// Leave chat
leaveBtn.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure to leave Room?');
  if (leaveRoom) {
    window.location = '../index.html'
  }
})

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Highlight your name in Users list in green color

//Join chatroom
socket.emit('joinRoom', { username, room })

// Emit message to server

function messageBox(obj) {
  const div = document.createElement('div');
  div.classList.add('message-box');
  const span = document.createElement('span');
  span.textContent = obj.username + " | " + obj.time;
  div.appendChild(span)
  const p = document.createElement('p');
  p.classList.add('chat-message')
  p.textContent = obj.text;
  div.appendChild(p)
  chatScreen.appendChild(div)
}

// Online user list - sidebar

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})


// Send message
sendBtn.addEventListener('click', () => {
  let newMes = newMessage.value;
  const obj = {
    newMes,
    username,
    room
  }
  socket.emit('chatMessage', obj)
  newMessage.value = '';
})

//newMessage from server to DOM
socket.on('newMessage', obj => {
  messageBox(obj)
  chatBox.scrollTop = chatBox.scrollHeight // ? duz islemir duzelt
})

// Time
const time = new Date();
const day = time.getDay();

// Add roomName
function outputRoomName(room) {
  roomName.textContent = room;
}

//User list
function outputUsers(users) {
  userNames.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}