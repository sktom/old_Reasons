
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

/*
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/Reasons';
var collection;
MongoClient.connect(url, function (err, db) {
  console.log(err);
  console.log('Connected.');
  //console.log(db.collections);
  //db.createCollection("abcd");
  console.log(db.idea_collection.find());
  //collection = db.createCollection("people", { size: 2147483648 } );
  //collection = db.idea_collection;//.insert({"idea" : "Teketo na Idea2"});
  //console.log(collection);
  //db.close();
});
*/

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

