
require('jquery-1.11.2.js');

var SketchCanvas = function(){};
SketchCanvas.id = 'idea_canvas';

SketchCanvas.init = function(x, y, c){
  var style = function(){};
  style['canvas'] = new Style({'position':'absolute', "top": y - 100, "left":x - 100, 'background-color':c, "width":280, "height":300});
  style['button'] = new Style({'position':'absolute', "top": y + 160, "left":x - 80, 'background-color':c, "width":240, "height":30});
  style['input'] = new Style({'position':'absolute', "top": y - 90, "left":x - 90, 'background-color':c, "width":260, "height":240});
  SketchCanvas.elements = $.map(['canvas', 'button', 'input'], function(type){
    element = generateElement(type, style[type]);
    SketchCanvas[type] = element;
    return element;
  }
);
  $.each(SketchCanvas.elements, function(key, value){
    //$('#' + value.id).css('opacity', '0');
    $('#' + value.id).hide(0);
  })
}

SketchCanvas.display = function(){
  $.each(SketchCanvas.elements, function(key, value){
    //$('#' + value.id).fadeTo(500, 1);
    $('#' + value.id).hide(500);
  })
  Status.sketch_canvas = 'active';
}
SketchCanvas.clear = function (){
  $.each(SketchCanvas.elements, function(key, value){
    //$('#' + value.id).fadeTo(500, 0);
    $('#' + value.id).show(500);
  })
  Status.sketch_canvas = 'inactive';
}

