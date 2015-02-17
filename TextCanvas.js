
require("./jquery-1.11.2.js");

IdeaCanvas = function(x, y, c){
  IdeaCanvas.count = IdeaCanvas.count == undefined ? 0 : IdeaCanvas.count + 1;

  IdeaCanvas.canvas = generateElement('canvas', x - 50, y - 50, c, this);
  IdeaCanvas.button = generateElement('button', x - 20, y + 20, c, this);
  IdeaCanvas.input = generateElement('input', x - 20, y - 20, c, this);

  /*
  button = document.createElement('button');
  document.body.appendChild(button);
  this.button = button;
  id_button = 'tc_button_' + IdeaCanvas.count;
  this.button.id = id_button;
  $('#' + id_button).css('background-color', c);
  $('#' + id_button).css({position:'absolute', top: y + 20, left:x - 20});

  text = document.createElement('input');
  document.body.appendChild(text);
  this.text = text;
  id_text = 'tc_text_' + IdeaCanvas.count;
  this.text.id = id_text;
  $('#' + id_text).css('background-color', c);
  $('#' + id_text).css({position:'absolute', top: y - 20, left:x - 20});
  */

}

