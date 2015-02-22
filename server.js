
var $ = require('jquery');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Reasons');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
});
var Idea = mongoose.model("Idea", mongoose.Schema({idea:String}));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  Idea.find(function(err, ideas){
    ideas.forEach(function(idea){
      io.emit("init_idea", idea);
    });
  });
  socket.on('add_idea', function(msg){
  console.log('__Connected.');
    io.emit('add_idea', msg);
    console.log(msg.idea.toString());
    idea = new Idea({"idea" : msg.idea});
    idea.save();
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

