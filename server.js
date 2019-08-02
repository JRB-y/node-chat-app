// express
const express = require('express');
// create express
const app = express();
// http server (create server with express app)
const server = require('http').createServer(app);
// socket.io (listen to server)
const io = require('socket.io').listen(server);

users = [];
connections = [];
// start server
server.listen(process.env.PORT || 3000)
// root get
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', (socket) => {
  // Connect
  connections.push(socket);
  console.log('Connected: %s socket(s) connected', connections.length);

  // Disconnect
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
  })

  // Send message
  socket.on('send-message', data => {
    io.sockets.emit('new-message', {
      msg: data,
      user: socket.username
    });
  });

  // new user
  socket.on('user-login', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get-users', users);
  }

})