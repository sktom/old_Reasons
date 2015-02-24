
var $ = require('jquery');

function p(arg){
  console.log(arg);
}

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
//var Idea = db.model("Idea", Schema({
  "idea":String, "idea_type" : Number,
  "parent":Schema.Types.ObjectId, "children":Array
}));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

function register_idea(msg){
  var idea = new Idea({
    "idea" : msg.idea, "idea_type" : msg.type,
    "parent" : msg.issue, "children" : []});
  idea.save();
  return idea;
}

io.on('connection', function(socket){
  //io.emit("add_idea", {"idea" : "Root Idea", "idea_type" : -1});
  socket.emit("transit", register_idea({"idea" : "Root Idea", "children" : [], "parent" : null, "idea_type" : -1})._id);

  socket.on("init_bord", function(issue){
    console.log("issue = " + issue);
    Idea.find({"_id" : issue}, function(err, parent_idea){
      parent_idea[0].children.forEach(function(idea){
        socket.emit("add_idea", idea);
      });
    });
  });

  function register_child(parent_id, child_id){
    Idea.findOne({"_id" : parent_id}, function(err, parent_idea){
      parent_idea.children.push(child_id);
      parent_idea.save();
    });
  }
  socket.on('submit_idea', function(msg){
    var idea = register_idea(msg);
    io.emit('add_idea', idea);
    register_child(msg.issue, idea.id);
  });

  socket.on('get_idea', function(id){
    console,log('get_idea');
    console.log(Idea.find({"_id" : id}).idea);
    Idea.find({"_id" : id}, function(err, ideas){
      //console.log(ideas[0].idea);
      socket.emit("add_idea", ideas[0]);
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

