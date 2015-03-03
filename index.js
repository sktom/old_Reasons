var $ = require('jquery');

function p(arg){
  console.log(arg);
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'localhost:27017');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
});
var Schema = mongoose.Schema;
var Idea = mongoose.model("Idea", Schema({
  "idea" : String, "idea_type" : Number,
  "issue" : Schema.Types.ObjectId, "children" : Array, "rating" : Number
}));
Idea.ifExist = function(idea_id, cb_if_exist, cb_if_not){
  Idea.find({"_id" : idea_id}, function(err, idea_list){
    idea = idea_list[0];
    if(idea){
      cb_if_exist(idea_id, idea);
    }else{
      cb_if_not(idea_id);
    }
  },{limit:1});
}
Idea.with_specified_idea = function(idea_id, cb){
  Idea.find({"_id" : idea_id}, function(err, idea_list){
    if(err){p("ERROR:Faild to specify an Idea by ID");}
    if( ! (idea_list.length == 1)){p("idea should be specified");}
    cb(idea_list[0]);
  },{limit:1});
}
Idea.with_parent_idea = function(parent_id, cb){
  Idea.find({"_id" : parent_id}, function(err, issue_idea_list){
    cb(parent_idea_list[0]);
  },{limit:1});
}
Idea.with_each_child = function(parent_id, cb){
  Idea.find({"_id" : parent_id}, function(err, issue_idea_list){
    issue_idea_list[0].children.forEach(function(child_id){
      Idea.find({"_id" : child_id}, function(err, child_idea_list){
        cb(child_idea_list[0]);
      },{limit:1});
    });
  },{limit:1});
}
Idea.with_children_id = function(parent_id, cb){
  Idea.find({"_id" : parent_id}, function(err, parent_idea_list){
    if(parent_idea_list.length == 0){return;}
    cb(parent_idea_list[0].children);
  },{limit:1});
}


app.get('/', function(req, res){
  res.sendfile('index.html');
});

function register_idea(msg){
  var idea = new Idea({
    "idea" : msg.idea, "idea_type" : msg.type,
    "issue" : msg.issue, "children" : [], "rating" : 0});
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
        "children" : [], "issue" : null, "rating" : 0});
    }
    socket.emit("transit", root.id);
  });

  /*
  socket.on("init_bord", function(issue){
    console.log("issue = " + issue);
    Idea.with_each_child(issue, function(child_idea){
      socket.emit("add_idea", child_idea);
    });
  });
  */

  socket.on("update", function(existing_id_list, issue){
    Idea.with_children_id(issue, function(brother_id_list){
      id_list_to_add = brother_id_list.filter(function(e){return(existing_id_list.indexOf(e) < 0);});
      id_list_to_delete = existing_id_list.filter(function(e){return(brother_id_list.indexOf(e) < 0);});
      id_list_to_add.forEach(function(idea_id){
        Idea.with_specified_idea(idea_id, function(idea){
          socket.emit("add_idea", idea);
        });
      });
      id_list_to_delete.forEach(function(idea_id){
        socket.emit("delete_floating_canvas", idea_id);
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
    socket.emit('add_idea', idea);
    register_child(msg.issue, idea.id);
  });

  function delete_idea(idea_id){
    p("delete_idea "+idea_id);
    Idea.findOne({"_id" : idea_id}, function(err, idea){
      idea.children.forEach(function(child_idea){
        delete_idea(child_idea);
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
    }, function(idea_id){return;});
  });

  socket.on("score", function(score){
    Idea.update({"_id" : score.idea_id}, {"rating" : score.rating}).exec();
  });


});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

