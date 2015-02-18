
required_files = new Array;
function require(file_path){
  if(required_files.indexOf(file_path) > -1){return;}
  document.write("<script type=\"text/javascript\" src=\"" + file_path + "\"><\/script>");
  required_files.push(file_path);
}

function p(arg){
  alert(arg);
}

Style = function(x, y, c, w, h){
  this.x = x; this.y = y; this.c = c; this.w = w; this.h = h;
  this.apply = function(element){
    if(element.id==""){p('NULL_ID_EXCEPTION@Style#apply');}
    $('#' + element.id).css({
      position:'absolute', top: y, left:x,
      'background-color':c, width:w, height:h});
    return element;
  }
  this.to_s = function(){
    return this.type + '_' + this.x + '_' + this.y + '_' + this.c.toString().substr(1);
  }
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

function generateElement(type, style, id){
  var element = document.createElement(type);
  document.body.appendChild(element);
  element.id = id || style.toString();
  $("#" + element.id).css(style);
  return element;
}

function random(n){
  if(n == null){n = 1;}
  return Math.random() * n;
}

String.prototype.escape = function() {
  return this.replace(/[\`\~\!\@\#\$\%\^\&\*\(\)\{\}\[\]\\\s\t]/g,'')
}
