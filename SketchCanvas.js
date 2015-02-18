
require('./jquery-1.11.2.min.js');
require('./jquery-ui.min.js ');

var SketchCanvas = function(){};
SketchCanvas.id = 'sketch_canvas';

SketchCanvas.init = function(x, y, c){
  var style = function(){};
  style['canvas'] = new Style({
    'position' : 'absolute', "top" : y - 100, "left" : x - 100,
    "width" : 280, "height" : 300, 'background-color' : c});
  style['button'] = new Style({
    'position' : 'absolute', "top" : y + 160, "left" : x - 80,
    "width" : 240, "height" : 30, 'background-color' : c});
  style['input'] = new Style({
    'position' : 'absolute', "top" : y - 90, "left" : x - 90,
    "width" : 260, "height" : 240, 'background-color' : c,
    "font-size" : "40px"});
  SketchCanvas.elements = $.map(['canvas', 'button', 'input'], function(type){
    element = generateElement(type, style[type], "sketch_canvas_" + type);
    SketchCanvas[type] = element;
    return element;
  }
);
  SketchCanvas["button"].addEventListener('click', add_idea, true);
  var keyDownCode = 0;
  $("#sketch_canvas_input").keydown(function(e){keyDownCode = e.which;});
  $("#sketch_canvas_input").keyup(function(e){if(13 == e.which && e.which == keyDownCode && !e.altKey){add_idea();}});

  SketchCanvas.clear(0);
}

SketchCanvas.display = function(duration){
  if(duration == null){duration = 500;}
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).show(duration);
  })
  $("#sketch_canvas_input").focus();
  SketchCanvas.state = 'active';
}
SketchCanvas.clear = function(duration){
  if(duration == null){duration = 500;}
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).hide(duration);
  })
  SketchCanvas.input.value = "";
  SketchCanvas.state = 'inactive';
}

var idea_list = [];
function add_idea(){
  var idea = SketchCanvas['input'].value;
  SketchCanvas.clear();
  if($.inArray(idea, idea_list) == -1){idea_list.push(idea);}else{return;}

  var idea_canvas = generateElement('canvas', new Style({
    "position" : "absolute",
    "top" : random() * screen.height, "left" : random() * screen.width,
    "width" : 150, "height" : 100, "background-color" : "#c0ffee"}),
    idea.escape());
  $("#" + idea_canvas.id).draggable();
  ctx = idea_canvas.getContext("2d");
  ctx.font = "50px Helvetica";
  ctx.fillText(idea, 0, 40);
}

