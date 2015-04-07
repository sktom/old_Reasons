
FloatingDiv = function(idea, x, y, issue){
  if(FloatingDivList.include(idea)){return;};
  this.idea = idea;
  this.idea_id = idea._id;

  var leaf = new Leaf(idea, x, y, issue);
  this.leaf = leaf;
  this.locate(5);
  var div = leaf.div;
  this.div = div;
  $(div).css({"position" : "absolute"});
  $(div).draggable({
    cancel : "text",
    containment : "#background_canvas",
    start : function(eo, ui){
      $(div).zIndex(FloatingDivList.get_max_zindex() + 1);
      window.noclick = true;
    },
    stop : function(eo){ }
  });

  this.width = function(){return leaf.width()}
  this.height = function(){return leaf.height()}

  /*
  this.reposition = function(){
    var offset = {"x" : 0, "y" : 0};
    $.each(FloatingDivList, function(fd){
    }):
  }
  */


  socket.emit("generate_branch_div", idea._id);

  this.add_branch_div = function(branch_div){
    this.branch_div = branch_div;
    branch_div.hide(0);
  }

  var obj = this;
  $(leaf.div).mouseover(function(e){
    if(obj.branch_div){obj.branch_div.show(500)}
  });
  $("#background_canvas").mouseover(function(){
    var value = leaf.rating();
    if(obj.branch_div){obj.branch_div.hide(500)}
    socket.emit("score", {
      "idea_id" : idea._id, "rating" : value
    });
  });
}

FloatingDiv.prototype.position = function(){
  return $(this.div).position();
}
FloatingDiv.prototype.locate = function(n){
  if( ! n > 0){return}
  var leaf = this.leaf;
  var width = leaf.width(); var height = leaf.height();
  var position = leaf.position();
  var x = position.left; var y = position.top;
  var this_ = this;
  FloatingDivList.each(function(fd){
    var fd_pos = fd.position();
    var fd_x = fd_pos.left; var fd_y = fd_pos.top;
    var fd_width = fd.width(); var fd_height = fd.height();
    if(((x < fd_x && fd_x < x + width) || (fd_x < x && x < fd_x + fd_width)) &&
      ((y < fd_y && fd_y < y + height) || (fd_y < y && y < fd_y + fd_height))){
      leaf.relocate();
      this_.locate(n-1);
    }
  });
}


function add_idea(idea){
  FloatingDivList.push(new FloatingDiv(idea));
}
function delete_idea(idea, floating_div){
  delete_floating_div(floating_div);
  socket.emit("delete_idea", idea._id);
}
function delete_floating_div(floating_div){
  FloatingDivList.remove(floating_div);
}

FloatingDivList = function(){}
FloatingDivList.entity = [];
FloatingDivList.push = function(floating_div){this.entity.push(floating_div);}
FloatingDivList.count = function(){return this.entity.length};
FloatingDivList.remove = function(target){
  this.entity = this.entity.filter(function(fd){return(fd != target)});
  document.body.removeChild(target.div);
}
FloatingDivList.include = function(idea){
  return this.entity.map(function(floating_div){
    return floating_div.idea;
  }).include(idea);
}
FloatingDivList.hide = function(){
  while(this.entity.length){
    var element = this.entity.pop().leaf.div;
    document.body.removeChild(element);
  }
}
FloatingDivList.each = function(callback){
  this.entity.forEach(callback);
}
FloatingDivList.find_by_id = function(idea_id){
  var arr = FloatingDivList.entity;
  var i = arr.map(function(canvas){return canvas.idea_id}).indexOf(idea_id);
  if(i < 0){
    return null;
  }else{
    return arr[i];
  }
}
FloatingDivList.get_id_list = function(){
  return this.entity.map(function(e){return e.idea_id});
}
FloatingDivList.get_max_zindex = function(){
  max_z = Math.max.apply(null, this.entity.map(function(floating_div){return floating_div.leaf.z_index()}));
  return(max_z < 0 ? 0 : max_z);
}

