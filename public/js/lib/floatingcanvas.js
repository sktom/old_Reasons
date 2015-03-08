
function add_idea(idea){
  var left = idea.left || random() * screen.width;
  var top = idea.top || random() * screen.height;

  if(FloatingDivList.include(idea.idea)){return;};
  //if($.inArray(idea.idea, idea_list) > -1){return;}

  var style = {"width" : 150, "height" : 100, "background-color" : "#c0ffee"};
  var floating_div = generateElement("div", $.extend(style, {"id" : idea._id, "position" : "absolute", "top" : top, "left" : left}));
  $("#" + floating_div.id).draggable();

  var floating_canvas = generateElement('canvas', {"parent" : floating_div, "style" : style, "id" : idea.idea.escape()});
  floating_div.appendChild(floating_canvas);
  ctx = floating_canvas.getContext("2d");
  ctx.font = "50px Helvetica";
  ctx.fillText(idea.idea, 0, 40);

  floating_div.idea_id = idea._id;

  $("#" + floating_canvas.id).mousedown(function(e){
    switch(e.which){
    case 1:
      floating_div.addEventListener('click', function(){
        transit(idea._id);
      }, true); break;
    case 3:
      delete_idea(idea, floating_div); break;
    }
  });

  var rating_slider = generateElement("div", { "position" : "absolute", "width" : style.width, "top" : 100});
  rating_slider.id = "slider_" + floating_div.id;
  floating_div.appendChild(rating_slider);

  $("#" + rating_slider.id).slider();

  $("#" + floating_div.id).mouseover(function(e){
    focus_on(floating_div);
  });
  floating_div.focus_on = function(){
    $("#" + rating_slider.id).show(500);
  }
  $("#"+floating_div.id).focusout(function(){
    p('aou');
    var value = $("#"+rating_slider.id).slider("value");
    $("#" + rating_slider.id).hide(500);
    socket.emit("score", {
      "idea_id" : floating_div.idea_id, "rating" : value
    });
  });

  FloatingDivList.push(floating_div);
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
FloatingDivList.remove = function(floating_div){
  this.entity = this.entity.eliminate(floating_div);
  document.body.removeChild(floating_div);
}
FloatingDivList.include = function(idea){
  return this.entity.map(function(floating_div){
    return floating_div.idea;
  }).include(idea);
}
FloatingDivList.clear = function(){
  while(this.entity.length){
    var element = this.entity.pop();
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

