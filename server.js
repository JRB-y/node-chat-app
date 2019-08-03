// express
const express = require('express');
// create express
const app = express();
// http server (create server with express app)
const server = require('http').createServer(app);
// socket.io (listen to server)
const io = require('socket.io').listen(server);
// path
const path = require('path');

// mustach
const mustache = require('mustache-express');
//configure mustache
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

users = [];
connections = [];
// start server
server.listen(process.env.PORT || 3000)


// root get
app.get('/about', (req, res) => {
  console.log(123);
  res.render('index')
  // res.sendFile(__dirname + '/public/index.html')

})

io.sockets.on('connection', (socket) => {
  // Connect
  connections.push(socket);
  console.log('Connected: %s socket(s) connected', connections.length);

  // Disconnect
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    users.splice(users.indexOf(socket.username), 1);
    console.log('Disconnected: %s socket(s) connected', connections.length);
    updateUsernames();
  })

  // Send message
  socket.on('send-message', data => {

    io.sockets.emit('new-message', {
      msg: data.msg,
      user: socket.username,
      date: convertDate(data.date)
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

  function convertDate(inputFormat) {
    function pad(s) {
      return (s < 10) ? '0' + s : s;
    }
    var d = new Date(inputFormat);
    var time = [d.getHours(), d.getMinutes()].join(':');
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/') + ' at ' + time;
  }

})