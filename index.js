var express = require('express');
var socket = require('socket.io');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 4000;

// App setup
var app = express();
var server = app.listen(port, function(){
  console.log('listening to requests on port 4000')
});


// Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('made socket connection', socket.id)

  socket.on('chat', function(data){
      io.sockets.emit('chat', data);
  });

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data)
  })

});