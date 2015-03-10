
function add_idea(idea){
  var left = idea.left || random() * screen.width;
  var top = idea.top || random() * screen.height;

  if(FloatingDivList.include(idea.idea)){return;};
  //if($.inArray(idea.idea, idea_list) > -1){return;}

  var style = {"height" : 0, "background-color" : "#c0ffee"};
  var floating_div = generateElement("div", $.extend(style, {
    "id" : idea._id, "position" : "absolute", "top" : top, "left" : left
  }));
  $("#" + floating_div.id).draggable({
    delay : 100,
    cancel : "text",
    start : function(e, ui){
      $(floating_div).zIndex(FloatingDivList.get_max_zindex() + 1);
      window.noclick = true;}
  });

  floating_div.idea_id = idea._id;

  floating_div.addEventListener("click", function(e){
    if(window.noclick){window.noclick = false; return;}

    transit(idea._id);
    e.stopPropagation();
  }, true);
  $("#" + floating_div.id).mousedown(function(e){
    switch(e.which){
    case 3:
      delete_idea(idea, floating_div);
      window.noclick = true;
      break;
    }
  });


  var text_area = generateElement("textarea", {
    "id" : "flooating_div_textarea_" + idea._id, "parent" : floating_div,
    "background-color" : "#c0ffee", "font-size" : idea.rating / 4 + 30
  });
  text_area.value = idea.idea;
  autosize(text_area);
  text_area.disabled = true;
  if(idea.idea.length + 5 < 20){text_area.cols = idea.idea.length + 5;}


  var rating_slider = generateElement("div", {
    "position" : "relative", "width" : $("#"+text_area.id).width + 5, "top" : -20
  });
  rating_slider.id = "slider_" + floating_div.id;
  floating_div.appendChild(rating_slider);
  rating_slider.addEventListener("click", function(e){
    e.stopPropagation();
  });

  $("#" + rating_slider.id).slider({start : function(e){window.noclick = true;}});

  $("#" + floating_div.id).mouseover(function(e){
    focus_on(floating_div);
  });
  floating_div.focus_on = function(){
    $("#" + rating_slider.id).show(500);
  }
  $("#"+floating_div.id).focusout(function(){
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
FloatingDivList.count = function(){return this.entity.length};
FloatingDivList.remove = function(target){
  this.entity = this.entity.filter(function(fd){return(fd != target)});
  document.body.removeChild(target);
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
FloatingDivList.get_max_zindex = function(){
  return Math.max.apply(null, this.entity.map(function(e){return $(e).zIndex();}));
}

