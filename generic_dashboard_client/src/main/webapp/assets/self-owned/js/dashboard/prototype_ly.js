function hi(){
  remove_css_class('dragContainer_div', 'dragContainer');
  $('.grid-stack-item-header').css('display','none');
  add_content_div(clone_component_v2('d0'),0,0,6,5);
  add_content_div(clone_component_v2('d1'),6,0,3,5);
  add_content_div(clone_component_v2('d2'),9,0,3,5);
  add_content_div(clone_component_v2('d3'),0,5,3,5);
  add_content_div(clone_component_v2('d4'),3,5,3,5);
  add_content_div(clone_component_v2('d5'),6,5,3,5);
  add_content_div(clone_component_v2('d6'),9,5,3,5);
}

function hi2(){
  remove_css_class('dragContainer_div', 'dragContainer');
  $('.grid-stack-item-header').css('display','none');
  add_content_div(clone_component_v2('b0'),0,0,2,3);
  add_content_div(clone_component_v2('b1'),2,0,2,3);
  add_content_div(clone_component_v2('b2'),4,0,2,3);
  add_content_div(clone_component_v2('b3'),0,3,2,3);
  add_content_div(clone_component_v2('b4'),2,3,2,3);
  add_content_div(clone_component_v2('b5'),4,3,2,3);
  add_content_div(clone_component_v2('b6'),0,6,6,3);

  // add_content_div(clone_component_v2('b7'),4,0,3,2);
  // add_content_div(clone_component_v2('b8'),4,3,3,2);
  // add_content_div(clone_component_v2('b9'),4,6,3,2);
  // add_content_div(clone_component_v2('b10'),4,9,3,2);
}

function test(){
  remove_css_class('dragContainer_div', 'dragContainer');
  $('.grid-stack-item-header').css('display','none');
  add_content_div(clone_component_v2('b0'),0,0,2,3);
}



var isView = false;
function switchMode(){
  if(isView){
    editMode();
  }else{
    viewMode();
  }
}

function viewMode() {
  if(isView){
    return;
  }
  isView = true;
  $('#main_content_div').css('padding-left','0px');
  $('#sidebar').css('display', 'none');
  $('#navbar').css('display', 'none');
  $('#hidden_div').css('display', 'none');
  $('#menubar_div').css('display', 'none');
  $('.seperate_div_class').css('display', 'none');
  $('#footer_div').css('display', 'none');
  $('#help-actions').css('display', 'none');
}

function editMode() {
  if(!isView){
    return;
  }
  isView = false;
  $('#main_content_div').css('padding-left','180px');
  $('#sidebar').css('display', '');
  $('#navbar').css('display', '');
  $('#hidden_div').css('display', '');
  $('#menubar_div').css('display', '');
  $('.seperate_div_class').css('display', '');
  $('#footer_div').css('display', '');
  $('#help-actions').css('display', '');
}



function add_shortcut_key_listener(){
//  document.onkeydown = keyDownSearch;
  $(document).on('keydown',command_mode);
}

function command_mode(e) {
  // 兼容FF和IE和Opera
  var theEvent = e || window.event;
  var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
  if (code == 119) { //F8
    switchMode();
    // return false;
  }

}

add_shortcut_key_listener();
