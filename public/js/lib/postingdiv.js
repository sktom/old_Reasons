
var PostingDivList = {};

PostingDivList.init = function(){
  var x = $(document).width() / 2;
  var y = $(document).height() / 2;
  var style = function(){};
  style['canvas'] = {"top" : y - 150, "left" : x - 150, "width" : 280, "height" : 300};
  style['button'] = {"top" : y + 110, "left" : x - 130, "width" : 240, "height" : 30};
  style['textarea'] = {"top" : y - 140, "left" : x - 140, "width" : 260, "height" : 240, "font-size" : "40px"};

  $.each(IdeaTypes, function(i, type){
    var posting_div = generateElement("div", {"id" : "posting_div_" + type});
    posting_div.elements = $.map(['canvas', 'button', 'textarea'], function(element_type){
      var element = generateElement(element_type, $.extend(style[element_type], {
        "background-color" : color_list[type], "position" :  "absolute",
          "id" : "posting_div_" + type + "_" + element_type, "parent" : posting_div
      }));
      posting_div[element_type] = element;
      return element;
    });
    $(posting_div).css("z-index", FloatingDivList.get_max_zindex() + 2);
    posting_div["button"].addEventListener("click", function(){submit_idea(type)}, true);
    $(posting_div).click(function(e){return false});
    var keyDownCode = 0;
    $(posting_div["textarea"]).keydown(function(e){keyDownCode = e.which;});
    $(posting_div["textarea"]).keyup(function(e){if(13 == e.which && e.which == keyDownCode && !e.altKey){
      submit_idea(type);
    }});
    PostingDivList[type] = posting_div;
  })

  this.hide(0);
}

submit_idea = function(type){
  var sentence = PostingDivList[type]["textarea"].value;
  if(sentence.length > 40){p("The sentence is too long(should be < 40)"); return}
  socket.emit("submit_idea", {"sentence" : sentence, "issue" : issue._id, "type" : type});
  PostingDivList.hide(500);
}


//var PostingDiv = generateElement("div", {"id" : "posting_div"});

/*
   PostingDiv.init = function(x, y, c){
   document.body.appendChild(this.entity);
//$("#"+PostingDiv.id).draggable();
}
*/

PostingDivList.show = function(type, duration){
  if(duration == null){duration = 500;}
  $("#" + PostingDivList[type].id).show(duration);
  $("#posting_div_" + type + "_textarea").focus();
  PostingDivList.state = "active";
}
PostingDivList.hide = function(duration){
  if(duration == null){duration = 500;}
  $.each(IdeaTypes, function(i, type){
    $("#" + PostingDivList[type]["textarea"].id).val("");
    $("#" + PostingDivList[type].id).hide(duration);
  })
  PostingDivList.state = "inactive";
}


var PostingTypeDiv = generateElement("div", {"id" : "posting_type_div"});

PostingTypeDiv.select = function(type, canvas){
  this.hide(500);
  PostingDivList.show(type);
}

PostingTypeDiv.init = function(){
  document.body.appendChild(this);
  var style = function(){};
  var x = $(document).width() / 2;
  var y = $(document).height() / 2;
  var size = 180;
  style["assent"] = {"top" : y - size, "left" : x - size};
  style["dissent"] = {"top" : y - size, "left" : x - 0};
  style["propose"] = {"top" : y - 0, "left" : x - size};
  style["question"] = {"top" : y - 0, "left" : x - 0};
  half = size / 2; quarter = half / 2;
  style["theme"] = {"top" : y - quarter, "left" : x - quarter, "width" : half, "height" : half};
  $.each(IdeaTypes, function(i, type){
    var canvas = generateElement("canvas", $.extend({
      "position" : "absolute", "font-size" : "40px", "width" : size, "height" : size,
      "id" : "posting_type_canvas_" + type, "parent" : PostingTypeDiv,
      "background-color" : color_list[type]}
      , style[type]
    ));
    canvas["color"] = style[type]["background-color"];
    PostingTypeDiv[type] = canvas;
    canvas.addEventListener("click", function(e){
      PostingTypeDiv.select(type, canvas);
      e.stopPropagation();
    });
    canvas.addEventListener("click", function(){PostingTypeDiv.select(type, canvas)}, true);
    var keyDownCode = 0;
  });

  this.hide(0);
}

PostingTypeDiv.show = function(duration){
  if(duration == null){duration = 500;}

  //$(PostingTypeDiv).css("z-index", FloatingDivList.get_max_zindex() + 2);
  $.each(IdeaTypes, function(i, type){
    $("#posting_type_canvas_" + type).css("z-index", FloatingDivList.get_max_zindex() + 2);
  });

  $("#" + PostingTypeDiv.id).show(500);
  $("#" + PostingTypeDiv.id).hide(0);
  $("#" + PostingTypeDiv.id).show(0);
  //window.scroll(1, 0); window.scroll(0, 0);

  PostingTypeDiv.state = "active";
}
PostingTypeDiv.hide = function(duration){
  if(duration == null){duration = 500;}
  $("#" + PostingTypeDiv.id).hide(duration);
  PostingTypeDiv.state = "inactive";
}

