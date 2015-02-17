
required_files = new Array;
function require(file_path){
  if(required_files.indexOf(file_path) > -1){return;}
  document.write("<script type=\"text/javascript\" src=\""+file_path+"\"><\/script>");
  required_files.push(file_path);
}

function p(arg){
  alert(arg);
}

Style = function(x, y, c, w, h){
  this.x = x; this.y = y; this.c = c; this.w = w; this.h = h;
  this.apply = function(element){
    if(element.id==""){p('NULL_ID_EXCEPTION@Style#apply');}
    $('#' + element.id).css({position:'absolute', top: y, left:x, 'background-color':c, width:w, height:h});
    return element;
  }
  this.to_s = function(){
    return this.type + '_' + this.x + '_' + this.y + '_' + this.c.toString().substr(1);
  }
}

function generateElement(type, style){
  if(SketchCanvas[type]){return SketchCanvas[type];}

  var element = document.createElement(type);
  document.body.appendChild(element);
  element.id = style.to_s();
  return style.apply(element);
}
