
Leaf = function(idea, left, top, issue, small){
  small = small || 0;
  this.set_position(left, top);
  var parent_element = issue || document.body;
  var leaf = this;
  this.idea = idea; this.idea_id = idea._id;

  var style = {"height" : 0};//, "background-color" : color_list[idea.type]};
  var div = generateElement("div", $.extend(style, {
    "id" : idea._id, "position" : "absolute", "top" : this.top, "left" : this.left, "parent" : parent_element
  }));
  this.div = div;

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
    "position" : "absolute", "top" : "-10px", "left" : "-10px",
    "background-color" : color_list[idea.type], "font-size" : (idea.rating - small) / 4 + 32,
    "margin" : "0.3em", "class" : "leaf"
  });
  if(idea.type == "theme"){$(text_area).css({ "color" : "#000000",
    "text-shadow" : "1px 1px 0.5px #ffffff, -1px 1px 0.5px #ffffff, 1px -1px 0.5px #ffffff, -1px -1px 0.5px #ffffff"})};
  this.text_area = text_area;
  text_area.value = idea.sentence;
  autosize(text_area);
  text_area.disabled = true;
  if(idea.sentence.length + 5 < 20){text_area.cols = idea.sentence.length + 5;}

  this.width = function(){return $(text_area).width()};
  this.height = function(){return $(text_area).height()};
  this.position = function(){return $(div).position()};

  var rating_slider = generateElement("div", {
    "position" : "relative", "width" : $("#"+text_area.id).width + 5, "top" : $(text_area).height()
  });
  $(rating_slider).slider({"value" : 50});
  this.rating_slider = rating_slider;
  rating_slider.id = "slider_" + div.id;
  div.appendChild(rating_slider);
  rating_slider.addEventListener("click", function(e){
    e.stopPropagation();
  });
  this.rating = function(){return $(rating_slider).slider("value") - 50}

  $("#" + rating_slider.id).slider({start : function(e){window.noclick = true;}});

  $(this.div).css({"width" : $(this.text_area).width(), "height" : $(this.text_area).height()});

}
Leaf.prototype.set_position = function(left, top){
  if(left == undefined){left = random() * $("#background_canvas").width() * 0.8};
  if(top == undefined){top = random() * $("#background_canvas").height() * 0.9};
  this.top = top; this.left = left;
}
Leaf.prototype.relocate = function(left, top){
  this.set_position(left, top);
  $(this.div).css({"left" : this.left, "top" : this.top});
}

