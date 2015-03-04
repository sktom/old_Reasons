
function p(arg){
  alert(arg);
}

Array.prototype.eliminate = function(target){
  return this.filter(function(element){ return(element!=target)});
}
Array.prototype.include = function(element){
  return this.indexOf(element) > 0;
}

Style = function(pref){
  obj = this;
  $.each(pref, function(k, v){
    obj[k] = v;
  });
}

Style.prototype.toString = function(){
  var obj = this;
  return $.map(Object.keys(this), function(k){
    if(obj[k]==null){return "";}
    return(k.toString().escape() + "_" + obj[k].toString().replace(/#/g, ''));
  }).join("-");
}

function generateElement(type, option){
  var element = document.createElement(type);
  document.body.appendChild(element);
  element.id = option.id || option.style.toString();
  $("#" + element.id).css(option.style);
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


