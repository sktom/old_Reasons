
function add_idea(idea){
  var left = idea.left || random() * screen.width;
  var top = idea.top || random() * screen.height;

  SketchCanvas.clear();
  if(FloatingCanvasList.include(idea.idea)){return;};
  //if($.inArray(idea.idea, idea_list) > -1){return;}

  var style = new Style({
    "position" : "absolute", "top" : top, "left" : left,
    "width" : 150, "height" : 100, "background-color" : "#c0ffee"});
  var floating_canvas = generateElement('canvas', {"style" : style, "id" : idea.idea.escape()});
  $("#" + floating_canvas.id).draggable();
  ctx = floating_canvas.getContext("2d");
  ctx.font = "50px Helvetica";
  ctx.fillText(idea.idea, 0, 40);
  floating_canvas.idea_id = idea._id;

  $("#" + floating_canvas.id).mousedown(function(e){
    switch(e.which){
    case 1:
      floating_canvas.addEventListener('click', function(){
        transit(idea._id);
      }, true); break;
    case 3:
      delete_idea(idea, floating_canvas); break;
    }
  });

  /*
  var rating_slider_div = generateElement("div", {"style" : new Style({
    "position" : "absolute", "width" : style.width, "top" : style.top + 100, "left" : style.left})
  });
  rating_slider_div.id = "slider_" + floating_canvas.id;
  */
  rating_slider_div_id = "slider_" + floating_canvas.id;

  floating_canvas.innerHTML = "<div id = " + rating_slider_div_id + " position:absolute width:" + style.width + " top:" + style.top + " left:" + style.left;



  //$("#" + rating_slider_div.id).slider();
  $("#" + rating_slider_div_id).slider();
  //document.body.removeChild(rating_slider_div);

  $("#" + floating_canvas.id).mouseover(function(e){
    focus_on(floating_canvas);
  });
  floating_canvas.focus_on = function(){
    $("#" + floating_canvas.id).css({"height" : style.height + 0});
    //document.body.appendChild(rating_slider_div);
    $("#" + rating_slider_div_id).css({
      "position" : "absolute", "width" : style.width, "top" : style.top + 100, "left" : style.left
    });
  }
  floating_canvas.focus_out = function(){
    $("#" + floating_canvas.id).css({"height" : style.height});
    socket.emit("score", {
      "idea_id" : floating_canvas.idea_id, "rating" : $("#"+rating_slider_div_id).slider("value")
    });
    document.body.removeChild(rating_slider_div);

  }

  FloatingCanvasList.push(floating_canvas);
}
function delete_idea(idea, floating_canvas){
  delete_floating_canvas(floating_canvas);
  socket.emit("delete_idea", idea._id);
}
function delete_floating_canvas(floating_canvas){
  FloatingCanvasList.remove(floating_canvas);
}

FloatingCanvasList = function(){}
FloatingCanvasList.entity = [];
FloatingCanvasList.push = function(floating_canvas){this.entity.push(floating_canvas);}
FloatingCanvasList.remove = function(floating_canvas){
  this.entity = this.entity.eliminate(floating_canvas);
  document.body.removeChild(floating_canvas);
}
FloatingCanvasList.include = function(idea){
  return this.entity.map(function(floating_canvas){
    return floating_canvas.idea;
  }).include(idea);
}
FloatingCanvasList.clear = function(){
  while(this.entity.length){
    var element = this.entity.pop();
    document.body.removeChild(element);
  }
}
FloatingCanvasList.find_by_id = function(idea_id){
  var arr = FloatingCanvasList.entity;
  var i = arr.map(function(canvas){return canvas.idea_id}).indexOf(idea_id);
  if(i < 0){
    return null;
  }else{
    return arr[i];
  }
}
FloatingCanvasList.get_id_list = function(){
  return this.entity.map(function(e){return e.idea_id});
}

