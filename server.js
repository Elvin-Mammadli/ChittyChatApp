const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./public/utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/users')

const app = express();
const server = app.listen(4000, () => {
  console.log("server up on port 4000")
})

app.use(express.static('public'));

const botName = "ChittyChat"

const io = socket(server);


io.on('connection', (socket) => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    //welcome message
    socket.emit("message", formatMessage(botName, `Welcome to chat Cord ${user.username}`))

    //Broadcast when user joins
    socket.broadcast
      .to(user.room)
      .emit("message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })


    // when disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if(user) {
        io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left`))
      }

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })

    })

    socket.on("chatMessage", (obj) => {
      io.to(user.room).emit("newMessage", formatMessage(obj.username, obj.newMes))
    })
  })


})