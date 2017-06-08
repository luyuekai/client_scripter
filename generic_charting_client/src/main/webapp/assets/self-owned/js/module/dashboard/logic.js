function addCell_chart(json) {
  if (json) {
    var option = ChartPOJO.deserialize_chart_option(json);
    addWidget_chart(option);
    if(viewModel){
      viewModel.hasNewContent(true);
    }
  }
};


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






function update_workbench_size(){
  var height= 0;
  if(isView){
    height = $(window).height()-60;
  }else{
    height =$(window).height()-290;
  }
  $('#workbench_div').css('height', height);
}


function initialize() {
  $(window).resize(function() {
    setTimeout(function() {
      update_workbench_size();
    }, 500)
  });
  update_workbench_size();
}


var SharePOJO = SharePOJO || {};
SharePOJO = {
    environmentCheck: function () {
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
    redirect: function (type) {
        if (type == 'INVALID') {
            console.log("REDIRECT TO INVALID PAGE");
            window.location.href = "404.html";
        } else if (type == 'EXPIRED') {
            console.log("REDIRECT TO EXPIRED PAGE");
            window.location.href = "404.html";
        } else if (type == 'NORMAL') {
            console.log("REDIRECT TO EDIT PAGE");

            initialize();
        }
    }
}
$.subscribe("MATRIX_SHARE_SUCCESS", successListener);
$.subscribe("MATRIX_SHARE_FAILED", failedListener);
$.subscribe("MATRIX_SHARE_SERVICE_FAILED", failedServiceListener);
$.subscribe("WORKBENCH_EVENT_CHANGE", WORKBENCH_EVENT_CHANGE_LISTENER);
function WORKBENCH_EVENT_CHANGE_LISTENER(){
  if(viewModel){
    viewModel.hasNewContent(true);
  }
}
function successListener() {
    if (arguments && arguments[1]) {
        var json = arguments[1].result[0];
        if (viewModel) {
          viewModel.deserialize_dashboard(json);
          viewModel.hasNewContent(false);
          if(current_mode == 'EDIT'){
            userCheck();
          }
        }
    }
}
function userCheck(){
  if(UserPOJO.user&& UserPOJO.user.userName && viewModel.data && viewModel.data.username){
    if(UserPOJO.user.userName!=viewModel.data.username){
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




function add_shortcut_key_listener(){
  document.onkeydown = keyDownSearch;
}

function add_shortcut_key_listener_view(){
  document.onkeydown = keyDownSearch_view;
}

function keyDownSearch(e) {
  // 兼容FF和IE和Opera
  var theEvent = e || window.event;
  var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
  if (code == 119) { //F8
    switchMode();
    // return false;
  }
  if (event.keyCode == 78 && event.shiftKey && event.altKey) {
    // alt+shift+n
    if(viewModel){
      ModalUtil.popup_modal('New Dashboard', '/assets/self-owned/html/dashboard/modal_content_new.html', null, null, null);
    }
  }
  if (event.keyCode == 83 && event.shiftKey && event.altKey) {
    // alt+shift+s
    if(viewModel){
      ModalUtil.popup_modal('Save Dashboard', '/assets/self-owned/html/dashboard/modal_content_save.html');
    }
  }

  if (event.keyCode == 69 && event.shiftKey && event.altKey) {
    // alt+shift+e
    if(viewModel){
      ModalUtil.popup_modal('Insert a new chart', '/assets/self-owned/html/dashboard/modal_content_insert_chart.html', null, null, null);
    }
  }
  if (event.keyCode == 85 && event.shiftKey && event.altKey) {
    // alt+shift+u
    if(viewModel){
      remove_css_class('dragContainer_div', 'dragContainer')
    }
  }
  if (event.keyCode == 86 && event.shiftKey && event.altKey) {
    // alt+shift+v
    if(viewModel){
      add_css_class('dragContainer_div', 'dragContainer')
    }
  }
  if (event.keyCode == 82 && event.shiftKey && event.altKey) {
    // alt+shift+r
    if(viewModel){
      refresh_workbench()
    }
  }
}
function keyDownSearch_view(e) {
  // 兼容FF和IE和Opera
  var theEvent = e || window.event;
  var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
  if (code == 119) { //F8
    switchMode();
  }
}
var isView = false;
var current_mode = null; //EDIT && VIEW
function switchMode(){
  if(isView){
    editMode();
  }else{
    viewMode();
  }
  update_workbench_size();
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


function save_dashboard(){
  $('#new_modal_clost_button').click();
    setTimeout(function() {
      $('#button_save').click();
    }, 500);
}
