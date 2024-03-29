var $ = require('jquery');

function p(arg){
  console.log(arg);
}

var express = require('express');
var app = express();
app.set("trust proxy", true);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'localhost:27017');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){});
var Schema = mongoose.Schema;

mongoose.smart_model = function(table_name, schema){
  var model = mongoose.model(table_name, schema);

  model.ifExist = function(id, cb_if_exist, cb_if_not){
    model.find({"_id" : id}, function(err, list){
      if( ! list){cb_if_not(id); return}
      element = list[0];
      if(element){
        cb_if_exist(id, element);
      }else{
        cb_if_not(id);
      }
    },{limit:1});
  }
  model.with_specified_element = function(id, cb){
    model.find({"_id" : id}, function(err, list){
      if(err){p("ERROR:Faild to specify an model by ID");}
      if( ! (list.length == 1)){p("record should be specified");}
      cb(list[0]);
    },{limit:1});
  }

  return model;
}

var User = mongoose.smart_model("User", Schema({
  "_id" : String, "gender" : String,// "birthday" : Date,
  "log" : Array, "rating" : Number
}));
function register_user(profile){
  console.log("start");
  console.log(profile.id);
  var user = new User({
    "_id" : profile.id, "gender" : profile.gender,
    //"birthday" : profile.birthday,
    "log" : [], "rating" : 0
  });
  user.save(function(err, thor) {
    if (err) console.error(err);
  });
  console.log("end");
  return user;
}

var Idea = mongoose.smart_model("Idea", Schema({
  "sentence" : String, "type" : String,
  "issue" : Schema.Types.ObjectId, "children" : Array, "rating" : Number
}));
function register_idea(msg){
  var idea = new Idea({
    "sentence" : msg.sentence, "type" : msg.type,
      "issue" : msg.issue, "children" : [], "rating" : 0});
  idea.save();
  return idea;
}
Idea.with_parent_idea = function(parent_id, cb){
  Idea.find({"_id" : parent_id}, function(err, issue_idea_list){
    cb(parent_idea_list[0]);
  },{limit:1});
}
Idea.with_each_child = function(parent_id, cb){
  var c = 0;
  Idea.find({"_id" : parent_id}, function(err, issue_idea_list){
    var children = issue_idea_list[0].children;
    children.forEach(function(child_id){
      Idea.find({"_id" : child_id}, function(err, child_idea_list){
        cb(child_idea_list[0]);
        c = c + 1;
        if(c == children.length){cb(null)};
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
  //res.sendfile('index.html');
  res.render('index');
});

io.on('connection', function(socket){
  function pm(msg){socket.emit("p", msg)}

  Idea.findOne({"issue" : null}, function(err, root){
    var issue_idea;
    if( ! root){
      p("adding issue");
      root = register_idea({
        "sentence" : "Top", "type" : "root",
           "children" : [], "issue" : null, "rating" : 0});
    }
    //socket.emit("transit", root.id);
    socket.emit("transit", root);
  });

  socket.on("generate_branch_div", function(idea_id){
    var children = [];
    Idea.with_each_child(idea_id, function(child){
      if(child == null){socket.emit("create_branch_div", idea_id, children)};
      children.push(child);
    });
  });

  socket.on("update", function(existing_id_list, issue){
    Idea.with_children_id(issue._id, function(brother_id_list){
      //brother_id_list = issue.children;
      brother_id_list.filter(function(e){true});
      id_list_to_add = brother_id_list.filter(function(e){return(existing_id_list.indexOf(e) < 0);});
      id_list_to_delete = existing_id_list.filter(function(e){return(brother_id_list.indexOf(e) < 0);});
      id_list_to_add.forEach(function(idea_id){
        Idea.with_specified_element(idea_id, function(idea){
          socket.emit("add_new_idea", idea);
        });
      });
      id_list_to_delete.forEach(function(idea_id){
        socket.emit("delete_floating_canvas", idea_id);
      });
    });
  });

  function update_issue(issue_id){
    Idea.with_specified_element(issue_id, function(issue){
      socket.emit('update_issue', issue);
    });
  }

  function register_child(issue_id, child_id){
    Idea.findOne({"_id" : issue_id}, function(err, issue_idea){
      issue_idea.children.push(child_id);
      issue_idea.save();
    });
  }
  socket.on('submit_idea', function(msg){
    var idea = register_idea(msg);
    register_child(msg.issue, idea.id);
    update_issue(msg.issue);
    socket.emit('add_idea', idea);
  });

  function delete_idea(idea_id){
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

  socket.on("puid", function(){
    pm(app.get("https://graph.facebook.com/me/"));
  });

  socket.on("FB_LOGIN", function(profile){
    User.ifExist(profile.id,
      function(){},
      function(){register_user(profile)});
  });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

