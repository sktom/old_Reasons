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
  "idea":String, "idea_type" : Number,
  "issue":Schema.Types.ObjectId, "children":Array
}));
Idea.ifExist = function(idea_id, cb_if_exist, cb_if_not){
  Idea.find({"_id" : idea_id}, function(err, idea_list){
    idea = idea_list[0];
    if(idea){
      cb_if_exist(idea_id, idea);
    }else{
      cb_if_not(idea_id);
    }
  }).limit(1)
}


app.get('/', function(req, res){
  res.sendfile('index.html');
});

function register_idea(msg){
  var idea = new Idea({
    "idea" : msg.idea, "idea_type" : msg.type,
    "issue" : msg.issue, "children" : []});
  idea.save();
  return idea;
}

io.on('connection', function(socket){
  Idea.findOne({"issue" : null}, function(err, root){
    var issue_idea;
    if( ! root){
      p("adding issue");
      root = register_idea({
        "idea" : "Root Idea", "idea_type" : -1,
        "children" : [], "issue" : null});
    }
    socket.emit("transit", root.id);
  });

  socket.on("init_bord", function(issue){
    console.log("issue = " + issue);
    Idea.findOne({"_id" : issue}, function(err, issue_idea){
      issue_idea.children.forEach(function(idea_id){
        Idea.findOne({"_id" : idea_id}, function(err, idea){
          socket.emit("add_idea", idea);
        });
      });
    });
  });

  function register_child(issue_id, child_id){
    Idea.findOne({"_id" : issue_id}, function(err, issue_idea){
      issue_idea.children.push(child_id);
      issue_idea.save();
    });
  }
  socket.on('submit_idea', function(msg){
    var idea = register_idea(msg);
    io.emit('add_idea', idea);
    register_child(msg.issue, idea.id);
  });

  function delete_idea(idea_id){
    Idea.findOne({"_id" : idea_id}, function(err, idea){
      idea.children.forEach(function(child){
        delete_idea(child);
      });
    });
    Idea.find({"_id" : idea_id}).remove().exec();
  }
  socket.on("delete_idea", function(idea_id){
    Idea.ifExist(idea_id, function(idea_id, idea){
      Idea.findOne({"_id" : idea.issue}, function(err, issue){
        issue.children = issue.children.filter(function(children, i){
          return(children != idea_id);
        });
        issue.save();
      });
      // delete children
      delete_idea(idea_id);
      // delete from every client
      io.emit("delete_floating_canvas", idea_id);
    }, function(idea_id){return;});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

