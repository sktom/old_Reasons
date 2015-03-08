
var PostingDiv = generateElement("div", {"id" : "posting_div"});

submit_idea = function(){
  socket.emit("submit_idea", {"idea" : PostingDiv["textarea"].value, "issue" : issue});
  PostingDiv.clear(500);
}
PostingDiv.init = function(x, y, c){
  document.body.appendChild(this);
  var style = function(){};
  style['canvas'] = {"top" : y - 150, "left" : x - 150, "width" : 280, "height" : 300};
  style['button'] = {"top" : y + 110, "left" : x - 130, "width" : 240, "height" : 30};
  style['textarea'] = {"top" : y - 140, "left" : x - 140, "width" : 260, "height" : 240,
    "font-size" : "40px"};
  PostingDiv.elements = $.map(['canvas', 'button', 'textarea'], function(type){
    var element = generateElement(type, $.extend(style[type], {
      "background-color" : c, "position" :  "absolute",
      "id" : "posting_div_" + type, "parent" : PostingDiv
    }));
    PostingDiv[type] = element;
    return element;
  });
  PostingDiv["button"].addEventListener("click", submit_idea, true);
  var keyDownCode = 0;
  $("#posting_div_textarea").keydown(function(e){keyDownCode = e.which;});
  $("#posting_div_textarea").keyup(function(e){if(13 == e.which && e.which == keyDownCode && !e.altKey){
    submit_idea();
  }});

  PostingDiv.clear(0);
}

PostingDiv.display = function(duration){
  if(duration == null){duration = 500;}
  $("#" + PostingDiv.id).show(duration);
  //$.each(PostingDiv.elements, function(key, value){
    //$('#' + value.id).show(duration);
  //})
  $("#posting_div_textarea").focus();
  PostingDiv.state = "active";
}
PostingDiv.clear = function(duration){
  if(duration == null){duration = 500;}
  $("#" + PostingDiv.id).hide(duration);
  /*
  $.each(PostingDiv.elements, function(key, value){
    $("#" + value.id).hide(duration);
  })
  */
  PostingDiv.textarea.value = "";
  PostingDiv.state = "inactive";
}

