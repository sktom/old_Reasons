
Leaf = function(idea, left, top, issue){
  var parent_element = issue || document.body;
  if(left == undefined){left = random() * $("#background_canvas").width() * 0.85};
  if(top == undefined){top = random() * $("#background_canvas").height() * 0.9};
  this.idea = idea; this.idea_id = idea._id;
  this.top = top; this.left = left;

  var style = {"height" : 0, "background-color" : color_list[idea.type]};
  var div = generateElement("div", $.extend(style, {
    "id" : idea._id, "position" : "absolute", "top" : top, "left" : left, "parent" : parent_element
  }));
  this.div = div;
  $(div).draggable({
    delay : 100,
    cancel : "text",
    start : function(e, ui){
      $(div).zIndex(FloatingDivList.get_max_zindex() + 1);
      window.noclick = true;
    }
  });
  this.z_index = function(){return $(div).zIndex()}

  var obj = this;

  div.addEventListener("click", function(e){
    if(window.noclick){window.noclick = false; return;}

    //transit(idea._id);
    transit(idea);
    e.stopPropagation();
  }, true);
  $("#" + div.id).mousedown(function(e){
    switch(e.which){
    case 3:
      delete_idea(idea, obj);
      window.noclick = true;
      break;
    }
  });

  var text_area = generateElement("textarea", {
    "id" : "floating_div_textarea_" + idea._id, "parent" : div,
    "background-color" : color_list[idea.type], "font-size" : idea.rating / 4 + 30,
    "margin" : "0.3em"
  });
  this.text_area = text_area;
  text_area.value = idea.sentence;
  autosize(text_area);
  text_area.disabled = true;
  if(idea.sentence.length + 5 < 20){text_area.cols = idea.sentence.length + 5;}
  this.width = function(){return $(text_area).width()};
  this.height = function(){return $(text_area).height()};

  var rating_slider = generateElement("div", {
    "position" : "relative", "width" : $("#"+text_area.id).width + 5, "top" : -20
  });
  this.rating_slider = rating_slider;
  rating_slider.id = "slider_" + div.id;
  div.appendChild(rating_slider);
  rating_slider.addEventListener("click", function(e){
    e.stopPropagation();
  });
  this.rating = function(){return $(rating_slider).slider("value")}

  $("#" + rating_slider.id).slider({start : function(e){window.noclick = true;}});

}

