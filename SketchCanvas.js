
require('jquery-1.11.2.js');

var SketchCanvas = function(){};
SketchCanvas.id = 'sketch_canvas';

SketchCanvas.init = function(x, y, c){
  var style = function(){};
  style['canvas'] = new Style(x, y, c);
  style['button'] = new Style(x + 20, y + 80, c);
  style['input'] = new Style(x + 20, y + 20, c);
  SketchCanvas.elements = $.map(['canvas', 'button', 'input'], function(type){
    element = generateElement(type, style[type]);
    SketchCanvas[type] = element;
    return element;
  }
);
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).css('opacity', '0');
  })
}

SketchCanvas.display = function(){
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).fadeTo(500, 1);
  })
  Status.sketch_canvas = 'active';
}
SketchCanvas.clear = function (){
  p('clear');
  $.each(SketchCanvas.elements, function(key, value){
    $('#' + value.id).fadeTo(500, 0);
  })
  Status.sketch_canvas = 'inactive';
}

