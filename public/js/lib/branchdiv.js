
BranchDiv = function(floating_div, children){
  var fd = floating_div.entity;
  var entity = generateElement("div", {"id" : "branch_div_" + floating_div.idea._id,
    "parent" : fd, "position" : "absolute"});
  var background = generateElement("canvas", {"id" : "branch_div_background_" + floating_div.idea._id,
    "parent" : fd, "position" : "absolute", "background" : "rgba(0, 0, 0, 0.1)", "top" : 0, "left" : fd.left, "width" : fd.width, "height" : 0});
  $(background).zIndex(0);
  $(background).hide(0);
  this.entity = entity;
  var issue = floating_div.idea;
  var x = 50;
  var y = 0;
  var w = $(floating_div.text_area).width();
  children.forEach(function(idea){
    child_floating_div = new FloatingDiv(idea, x, y, entity);
    y = y + $(child_floating_div.text_area).height() + 30;
    w = Math.max(w, $(child_floating_div.text_area).width());
  });
  $(background).height(y+100);// + $(floating_div).height());
  $(background).width(w + x + 20);// + $(floating_div).height());

  this.show = function(duration){
    duration = duration || 500;
    $(this.entity).show(duration);
    $(background).show(duration);
  }
  this.hide = function(duration){
    duration = duration || 500;
    $(this.entity).hide(duration);
    $(background).hide(duration);
  }

};


