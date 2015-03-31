
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


function requestFullScreen(element) {
  // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

//var color_list = {"assent" : "rgba(32, 178, 202, 1)", "dissent" : "rgba(247, 146, 86, 1)", "propose" : "rgba(110, 215, 176, 1)", "question" : "rgba(224, 217, 139, 1)", "theme" : "rgba(0, 0, 0, 0.5)", "root" : "rgba(0, 0, 0, 0)"};
var color_list = {"assent" : "rgba(32, 178, 256, 1)", "dissent" : "rgba(256, 146, 86, 1)", "propose" : "rgba(110, 256, 176, 1)", "question" : "rgba(256, 256, 130, 1)", "theme" : "rgba(0, 0, 0, 0.5)", "root" : "rgba(0, 0, 0, 0)"};

IdeaTypes = ["assent", "dissent", "propose", "question", "theme"];

