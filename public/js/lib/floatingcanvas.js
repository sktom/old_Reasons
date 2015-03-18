
FloatingDiv = function(idea){
  var left = idea.left || random() * $("#background_image").width() * 0.85;
  var top = idea.top || random() * $("#background_image").height() * 0.9;
  this.idea = idea;

  if(FloatingDivList.include(idea.sentence)){return;};
  //if($.inArray(idea.sentence, idea_list) > -1){return;}

  var style = {"height" : 0, "background-color" : color_list[idea.type]};
  var entity = generateElement("div", $.extend(style, {
    "id" : idea._id, "position" : "absolute", "top" : top, "left" : left
  }));
  $("#" + entity.id).draggable({
    delay : 100,
    cancel : "text",
    start : function(e, ui){
      $(entity).zIndex(FloatingDivList.get_max_zindex() + 1);
      window.noclick = true;}
  });

  this.idea_id = idea._id;
  this.entity = entity;

  var obj = this;
  entity.addEventListener("click", function(e){
    if(window.noclick){window.noclick = false; return;}

    //transit(idea._id);
    transit(idea);
    e.stopPropagation();
  }, true);
  $("#" + entity.id).mousedown(function(e){
    switch(e.which){
    case 3:
      delete_idea(idea, obj);
      window.noclick = true;
      break;
    }
  });

  var text_area = generateElement("textarea", {
    "id" : "flooating_div_textarea_" + idea._id, "parent" : entity,
    "background-color" : color_list[idea.type], "font-size" : idea.rating / 4 + 30
  });
  text_area.value = idea.sentence;
  autosize(text_area);
  text_area.disabled = true;
  if(idea.sentence.length + 5 < 20){text_area.cols = idea.sentence.length + 5;}

  var rating_slider = generateElement("div", {
    "position" : "relative", "width" : $("#"+text_area.id).width + 5, "top" : -20
  });
  rating_slider.id = "slider_" + entity.id;
  entity.appendChild(rating_slider);
  rating_slider.addEventListener("click", function(e){
    e.stopPropagation();
  });

  $("#" + rating_slider.id).slider({start : function(e){window.noclick = true;}});

  /*
  $("#" + entity.id).mouseover(function(e){
    focus_on(entity);
  });
  floating_div.focus_on = function(){
    $("#" + rating_slider.id).show(500);
  }
  */
  $("#"+entity.id).focusout(function(){
    var value = $("#"+rating_slider.id).slider("value");
    //$("#" + rating_slider.id).hide(500);
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
  document.body.removeChild(target.entity);
}
FloatingDivList.include = function(idea){
  return this.entity.map(function(floating_div){
    return floating_div.idea;
  }).include(idea);
}
FloatingDivList.hide = function(){
  while(this.entity.length){
    var element = this.entity.pop().entity;
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
  max_z = Math.max.apply(null, this.entity.map(function(floating_div){return $(floating_div.entity).zIndex();}));
  return(max_z < 0 ? 0 : max_z);
}

