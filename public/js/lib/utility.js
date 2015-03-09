
function p(arg){
  alert(arg);
}

function clone(original){
  return $.extend({}, original);
}

function stringize(obj){
  return $.map(Object.keys(obj), function(k, v){
    if(v == null){return "";}
    return(k.toString().escape() + "_" + v.toString().replace(/#/g, ''));
  }).join("-");
}

Array.prototype.eliminate = function(target){
  return this.filter(function(element){return(element!=target)});
}
Array.prototype.include = function(element){
  return this.indexOf(element) > 0;
}

function generateElement(type, style){
  style = style || {};
  var element = document.createElement(type);
  element.id = style.id || stringize(style);
  var parent_element = style.parent || document.body;
  if( ! parent_element){return element;}
  parent_element.appendChild(element);
  if(style){$("#" + element.id).css(style);}
  $("#" + element.id).bind('contextmenu', function(e){return false;}); 
  return element;
}

function random(n){
  if(n == null){n = 1;}
  return Math.random() * n;
}

String.prototype.escape = function() {
  return this.replace(/[\`\~\!\@\#\$\%\^\&\*\(\)\{\}\[\]\?\\\/\s\t]/g,'')
}

Array.prototype.last = function(){
  return this[this.length - 1];
}

