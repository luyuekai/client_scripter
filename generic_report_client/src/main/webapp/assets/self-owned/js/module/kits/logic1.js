var template_tag_list = ["TEMPLATE"];
//var tag_list = ["TEXT", " NATURAL_LANGUAGE", " IMAGE", " VIDEO", " VOICE", " MACHINE_LEARNING", " INTERNET", " ECONOMY", " TRANSPORTATION", " HEALTH", " REAL_ESTATE"];
var tag_list = ["TEXT", "IMAGE", "VOICE", "INTERNET", "ECONOMY", "TRANSPORTATION", "HEALTH", "REAL_ESTATE"];
var isView = false;
var current_mode = null; //EDIT && VIEW
function switchMode(){
  if(isView){
    editMode();
  }else{
    viewMode();
  }
}

function save_report(){
  $('#new_modal_clost_button').click();
    setTimeout(function() {
      $('#button_save').click();
    }, 500);
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
  $('#report_content_seperate_div').css('display', 'none');
  $('#footer_div').css('display', 'none');
  $('#help-actions').css('display', 'none');

  if(reportViewModel){
    reportViewModel.inactive_cells();
  }
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
  $('#report_content_seperate_div').css('display', '');
  $('#footer_div').css('display', '');
  $('#help-actions').css('display', '');
}


var SharePOJO = SharePOJO || {};
SharePOJO = {
  environmentCheck: function() {
    console.log("SHARE FUNCTION ENVIRONMENT CHECK...");

    console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[BEGIN]");
    var tokenFlag = $.hasUrlParam('token');
    if (tokenFlag) {
      console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:SUCCESSED]");
    } else {
      SharePOJO.redirect('NORMAL');
      console.log("ENVIRONMENT CHECK [STEP 1: Has token flag]...[FINISHED & RESULT:FAILED]");
      return;
    }
    console.log("ENVIRONMENT CHECK [STEP 2: Get token ]...[BEGIN]");
    var token = $.urlParamValue('token');
    if (token) {
      console.log("ENVIRONMENT CHECK [STEP 2: Get token]...[FINISHED & RESULT:SUCCESSED]");
    } else {
      SharePOJO.redirect('INVALID');
      console.log("ENVIRONMENT CHECK [STEP 2: Get token]...[FINISHED & RESULT:FAILED]");
    }

    console.log("ENVIRONMENT CHECK [STEP 3: validate token from SERVER side ... please invoke the correct URL and handle the response]...[BEGIN]");
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/fetch/' + token, null, "MATRIX_SHARE_SUCCESS", "MATRIX_SHARE_FAILED", "MATRIX_SHARE_SERVICE_FAILED");
  },

  redirect: function(type) {
    if (type == 'INVALID') {
      console.log("REDIRECT TO INVALID PAGE");
      window.location.href = "404.html";
    } else if (type == 'EXPIRED') {
      console.log("REDIRECT TO EXPIRED PAGE");
      window.location.href = "404.html";
    } else if (type == 'NORMAL') {
      console.log("REDIRECT TO EDIT PAGE");
    }
  }
}
$.subscribe("MATRIX_SHARE_SUCCESS", successListener);
$.subscribe("MATRIX_SHARE_FAILED", failedListener);
$.subscribe("MATRIX_SHARE_SERVICE_FAILED", failedServiceListener);
$.subscribe("get_user_detail_chain_finished", environment_check);
function environment_check(){
  SharePOJO.environmentCheck();
}

function successListener() {
  if (arguments && arguments[1]) {
//      debugger;
    var json = arguments[1].result[0];
    if (reportViewModel) {
      reportViewModel.deserialize_report(json);
      
      var datasetsStr = json.stringgamma;
      reportViewModel.related_datasets_json(datasetsStr);
      if(datasetsStr !== null || datasetsStr !== ""){
          var datasetsJson = JSON.parse(datasetsStr);
          $.each(datasetsJson, function (index, value) {
              reportViewModel.related_datasets().push({"id": index, "name": value});
          });
      }
      
      reportViewModel.hasNewContent(false);
      if(current_mode == 'EDIT'){
        userCheck();
      }
    }
  }
}

function userCheck(){
  if(UserPOJO.user&& UserPOJO.user.userName && reportViewModel.data && reportViewModel.data.username){
    if(UserPOJO.user.userName!=reportViewModel.data.username){
      console.log('user vlidation finished, to forbidden page');
      SharePOJO.redirect('INVALID');
    }
  }
}


function failedListener() {
  console.log("Server Failed!");
}

function failedServiceListener() {
  if (arguments && arguments[1]) {
    var errorMessage = arguments[1].errorMessage;
    if (errorMessage == "Token Invalid!") {
      console.log('request action invoked[request_invalid]');
      SharePOJO.redirect('INVALID');
    } else if (errorMessage == "Token Expire!") {
      console.log('request action invoked[request_expired]');
      SharePOJO.redirect('EXPIRED');
    }
  }
}



var converter = new showdown.Converter();
converter.setOption("tables", true);

//var reportViewModel = new ReportViewModel();
//
//reportViewModel.addCell();
//
//ko.applyBindings(reportViewModel, document.getElementById('main_content_div'));
















// *******Server Side Retrieve Data JS Code*******
var retrieveData_chart = function(page) {
  //        LoaderUtil.add('tableDIV');
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": pageMaxSize,
    "currentPageNumber": page || 1,
    "likeORMap": {

    },
    "eqMap": {
      "type": "MATRIX_CHART",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "CHART_SEARCH_SUCCESS_LISTENER", "CHART_PAGING_SEARCH_FAILED", "CHART_SERVICE_GENERIC_QUERY_FAILED");
}


// *******Server Side Retrieve Data Listener JS Code*******
$.subscribe("CHART_SEARCH_SUCCESS_LISTENER", successListener_chart);
$.subscribe("CHART_PAGING_SEARCH_FAILED", failedListener_chart);
$.subscribe("CHART_SERVICE_GENERIC_QUERY_FAILED", failedServiceListener_chart);


function failedServiceListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", "SERVICE 'GENERIC CUD' FAILED! Please contact with the system admin for more information...");
}

function failedListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  if (arguments && arguments[1]) {
    var errorMessage = arguments[1].errorMessage;
    genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", errorMessage);
  }
}

function successListener_chart() {
  if(!genericModalViewModel){
    return;
  }
  if (arguments && arguments[1]) {
    var data = arguments[1].result;
    displayResult = displayResult.concat(data);
    if (data.length < pageMaxSize) {
      hasNewData = false;
    }
    var history_scripts = displayResult.sort(sortTime);

    genericModalViewModel.businessPOJO().serverPagingViewModel.viewData(history_scripts);
  }
}

function sortTime(a, b) {
  return b.createtime - a.createtime;
}


function add_shortcut_key_listener(){
//  document.onkeydown = keyDownSearch;
  $(document).on('keydown',command_mode)
}
function command_to_edit(){
//    console.log($(document))
  $(document).unbind("keydown");
  $(document).on('keydown',edit_mode)
}
function edit_mode(e){
//    console.log("edit mode")
    if (event.keyCode==27) {
        //esc
//        edit_to_command();
  }
}
function edit_to_command(){
    $(document).unbind("keydown");
    $(document).on('keydown',command_mode);
}

function add_shortcut_key_listener_view(){
  document.onkeydown = keyDownSearch_view;
}

function command_mode(e) {
  // 兼容FF和IE和Opera
  var theEvent = e || window.event;
  var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
  if (code == 119) { //F8
    switchMode();
    // return false;
  }
  if (event.keyCode == 38 && event.shiftKey) {
    // shift+up
    if(reportViewModel){
      reportViewModel.upCell();
    }
  }
  if (event.keyCode == 40 && event.shiftKey) {
    // shift+down
    if(reportViewModel){
      reportViewModel.downCell();
    }
  }
  if (event.keyCode == 78 && event.shiftKey) {
    // shift+n
    if(reportViewModel){
      ModalUtil.popup_modal('New report', '/assets/self-owned/html/report/modal_content_new.html', null, null, null);
    }
  }
  if (event.keyCode == 83 && event.shiftKey) {
    // shift+s
    if(reportViewModel){
      ModalUtil.popup_modal_with_businessPOJO('Save report draft', '/assets/self-owned/html/report/modal_content_save_draft.html',reportViewModel);
    }
  }
  if (event.keyCode == 88 && event.shiftKey) {
    // shift+x
    if(reportViewModel){
      reportViewModel.cutCell();
    }
  }
  if (event.keyCode == 67 && event.shiftKey) {
    // shift+c
    if(reportViewModel){
      reportViewModel.copyCell();
    }
  }
  if (event.keyCode == 86 && event.shiftKey) {
    // shift+v
    if(reportViewModel){
      reportViewModel.pasteCell();
    }
  }
  if (event.keyCode == 68 && event.shiftKey) {
    // shift+d
    if(reportViewModel){
      reportViewModel.dropCell();
    }
  }
  if (event.keyCode == 65 && event.shiftKey) {
    // shift+a
    if(reportViewModel){
      reportViewModel.addCell();
    }
  }
  if (event.keyCode == 73 && event.shiftKey) {
    // shift+i
    if(reportViewModel){
      ModalUtil.popup_modal('Insert a new image', '/assets/self-owned/html/report/modal_content_upload_image.html', null, null, null);
    }
  }
  if (event.keyCode == 84 && event.shiftKey) {
    // shift+t
    if(reportViewModel){
      ModalUtil.popup_modal('Insert a new table cell', '/assets/self-owned/html/report/modal_content_insert_table.html', null, null, null);
    }
  }
  if (event.keyCode == 69 && event.shiftKey) {
    // shift+e
    if(reportViewModel){
      ModalUtil.popup_modal('Insert a new chart', '/assets/self-owned/html/report/modal_content_insert_chart.html', null, null, null);
    }
  }
  if (event.keyCode == 82 && event.shiftKey) {
    // shift+r
    if(reportViewModel){
      reportViewModel.compileCell();
    }
  }
//  if (event.keyCode==13&& event.shiftKey) {
//    // enter+shift
//    command_to_edit();
//  }

  // return true;
}
function keyDownSearch_view(e) {
  // 兼容FF和IE和Opera
  var theEvent = e || window.event;
  var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
  if (code == 119) { //F8
    switchMode();
  }
}
