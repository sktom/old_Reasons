
BranchDiv = function(floating_div, children){
  var parent_leaf = floating_div.leaf;
  var div = generateElement("div", {"id" : "branch_div_" + floating_div.idea._id,
    "parent" : parent_leaf.div, "position" : "absolute"});
  var background = generateElement("canvas", {"id" : "branch_div_background_" + floating_div.idea._id,
    "parent" : parent_leaf.div, "position" : "absolute", "background" : "rgba(0, 0, 0, 0.1)", "top" : 0, "left" : 0, "width" : parent_leaf.width, "height" : 0});
  $(background).zIndex(0);
  $(background).hide(0);
  this.div = div;
  var issue = floating_div.idea;
  var x = 50;
  var y = -10;
  var w = floating_div.width();
  children.forEach(function(idea){
    var leaf = new Leaf(idea, x, y, div);
    y = y + leaf.height() * 1.4;
    w = Math.max(w, leaf.width());
  });
  $(background).height(y + floating_div.height() * 1.4);
  $(background).width(w + x * 2);// + $(floating_div).height());


  this.show = function(duration){
    duration = duration || 500;
    $(this.div).show(duration);
    $(background).show(duration);
  }
  this.hide = function(duration){
    duration = duration || 500;
    $(this.div).hide(duration);
    $(background).hide(duration);
  }

};


