
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('add_idea', function(idea){
    //io.emit('chat message', msg);
    console.log(idea);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

