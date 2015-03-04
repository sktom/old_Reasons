
var SketchCanvas = function(){};
SketchCanvas.id = 'sketch_canvas';

submit_idea = function(){
  socket.emit("submit_idea", {"idea" : SketchCanvas["textarea"].value, "issue" : issue});
}
SketchCanvas.init = function(x, y, c){
  var style = function(){};
  style['canvas'] = new Style({
    'position' : 'absolute', "top" : y - 150, "left" : x - 150,
    "width" : 280, "height" : 300, 'background-color' : c});
  style['button'] = new Style({
    'position' : 'absolute', "top" : y + 110, "left" : x - 130,
    "width" : 240, "height" : 30, 'background-color' : c});
  style['textarea'] = new Style({
    'position' : 'absolute', "top" : y - 140, "left" : x - 140,
    "width" : 260, "height" : 240, 'background-color' : c,
    "font-size" : "40px"});
  SketchCanvas.elements = $.map(['canvas', 'button', 'textarea'], function(type){
    var element = generateElement(type, {"style" : style[type], "id" : "sketch_canvas_" + type});
    SketchCanvas[type] = element;
    return element;
  });
  SketchCanvas["button"].addEventListener("click", submit_idea, true);
  var keyDownCode = 0;
  $("#sketch_canvas_textarea").keydown(function(e){keyDownCode = e.which;});
  $("#sketch_canvas_textarea").keyup(function(e){if(13 == e.which && e.which == keyDownCode && !e.altKey){
    submit_idea();
  }});

  SketchCanvas.clear(0);
}

SketchCanvas.display = function(duration){
  if(duration == null){duration = 500;}
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).show(duration);
  })
  $("#sketch_canvas_textarea").focus();
  SketchCanvas.state = "active";
}
SketchCanvas.clear = function(duration){
  if(duration == null){duration = 500;}
  $.each(SketchCanvas.elements, function(key, value){
    $("#" + value.id).hide(duration);
  })
  SketchCanvas.textarea.value = "";
  SketchCanvas.state = "inactive";
}

