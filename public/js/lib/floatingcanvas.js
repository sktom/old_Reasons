
FloatingDiv = function(idea, x, y, issue){
  if(FloatingDivList.include(idea.sentence)){return;};
  this.idea = idea;
  this.idea_id = idea._id;

  var leaf = new Leaf(idea, x, y, issue);
  this.leaf = leaf;
  this.div = leaf.div;


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

