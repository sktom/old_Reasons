
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
var Schema = mongoose.Schema;
var Idea = mongoose.model("Idea", Schema({
  "idea":String, "type" : Number,
  "parent":Schema.Types.ObjectId, "children":Array
}));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  io.emit("init_idea", {"idea" : "Root Idea", "type" : -1});
  Idea.find(function(err, ideas){
    ideas.forEach(function(idea){
      io.emit("init_idea", idea);
    });
  });
  socket.on('submit_idea', function(msg){
    var idea = new Idea({
      "idea" : msg.idea, "type" : msg.type, "parent" : msg.issue});
    idea.save();
    io.emit('add_idea', idea);
    var parent_idea = (msg.issue == null) ? Idea.find({"type" : -1}) : Idea.find({"_id" : msg.issue});
    var brothers = Idea.find({"_id" : msg.issue}).children || [];
    //Idea.update({"_id" : msg.issue}, {"children" : brothers.push(idea._id)});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

