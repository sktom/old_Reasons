
require('jquery-1.11.2.js');

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
    "width" : 260, "height" : 240, 'background-color' : c});
  SketchCanvas.elements = $.map(['canvas', 'button', 'input'], function(type){
    element = generateElement(type, style[type], "sketch_canvas_" + type);
    SketchCanvas[type] = element;
    return element;
  }
);
  SketchCanvas["button"].addEventListener('click', add_idea, true);

  SketchCanvas.clear(0);
}

SketchCanvas.display = function(duration){
  if(duration == null){duration = 500;}
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).show(duration);
  })
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

function add_idea(){
  var idea_canvas = generateElement('canvas', new Style({
    "position" : "absolute",
    "top" : random() * screen.height, "left" : random() * screen.width,
    "width" : 150, "height" : 100,
    "background-color" : "#c0ffee"}),
    SketchCanvas['input'].value.replace(/#/g, ""));
  ctx = idea_canvas.getContext("2d");
  ctx.font = "40px Helvetica";
  ctx.fillText(SketchCanvas.input.value, 0, 40);

  SketchCanvas.clear();
}
