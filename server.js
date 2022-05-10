const express = require('express');
const path = require('path');
const http = require('http');
const PORT = 3000;
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(PORT);
app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('connection');

  socket.on('join-request', (username) => {
    socket.username = username;
    connectedUsers.push( username );
    console.log( username );

    socket.emit('user-ok', connectedUsers);
    socket.broadcast.emit('list-update',{
      joined: username,
      list: connectedUsers
    });
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(u => u != socket.username);
    console.log(connectedUsers);
    
    socket.broadcast.emit('list-update', {
      left: socket.username,
      list: connectedUsers
    });
  });

  socket.on('send-msg', (txt) => {
    let obj = {
      username: socket.username,
      message: txt
    };
    
    socket.emit('show-msg', obj);
    socket.broadcast.emit('show-msg', obj);
  });
});


