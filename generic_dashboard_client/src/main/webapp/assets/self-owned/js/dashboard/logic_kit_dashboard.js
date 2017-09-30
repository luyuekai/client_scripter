var vm = new GenericPageViewModel();
//Clean Data Bind Node for dynamic table
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
current_vm = vm;
current_max_x = 0;

function env_setup() {
  cookie_env_setup();
  vm_env_setup();
  setup_default_workbench();

}
function cookie_env_setup(){
  var token_lag = $.hasUrlParam('token');
  if (token_lag) {
    var token = $.urlParamValue('token');
    if(token){
      CachePOJO.businessPOJO = token;
    }
  }
}

// Setup the business model with view model
function vm_env_setup() {
  var businessPOJO = new DashboardViewModel(vm);
  vm.businessPOJO(businessPOJO);
  if(CachePOJO.businessPOJO){
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/fetch/' + CachePOJO.businessPOJO, null, "MATRIX_SHARE_SUCCESS","DEFAULT_RETRIEVE_API_FAILED_LISTENER", "DEFAULT_RETRIEVE_API_EXCEPTION_LISTENER");
  }
  window.addEventListener("beforeunload", function(e) {
    if (vm.businessPOJO().hasNewContent()) {
      var confirmationMessage = 'if you see this, you are definitely the chosen one';
      (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
      return confirmationMessage; // Gecko and WebKit
    }
  });
}

$.subscribe("MATRIX_SHARE_SUCCESS", successListener);
function successListener() {
    if (arguments && arguments[1]) {
        var json = arguments[1].result[0];
        if (vm && vm.businessPOJO()) {
          vm.businessPOJO().deserialize_dashboard(json);
          vm.businessPOJO().hasNewContent(false);
          // if(current_mode == 'EDIT'){
          //   userCheck();
          // }
        }
        // console.log(json);
        // deserialize_dashboard(json);
        // $('.grid-stack-item-header').css('display','none');
    }
}


$.subscribe("WORKBENCH_EVENT_CHANGE", WORKBENCH_EVENT_CHANGE_LISTENER);

function WORKBENCH_EVENT_CHANGE_LISTENER(){
  if (vm && vm.businessPOJO()) {
    vm.businessPOJO().hasNewContent(true);
  }
}
function addCell_chart(json) {
    if (json) {
        var option = ChartPOJO.deserialize_chart_option(json);
        // if (option.series[0].type == 'wordCloud') {
        //     var a = option.series;
        //     a[0].textStyle.normal.color = function () {
        //         var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        //         return colors[parseInt(Math.random() * 10)];
        //     };
        //     option.series = a;
        // }
        //
        //update cache
        WorkbenchCache.updateCache();
        var max_widget_y = 0;
        var max_widget_y_height = null;

        $.each(WorkbenchCache.array_elements,function(i,v){
          if(max_widget_y<=v.widget_element.widget_y){
            max_widget_y = v.widget_element.widget_y;
            max_widget_y_height = v.widget_element.widget_height;
          }
        });
        max_widget_y_height = max_widget_y_height || 6;
        max_widget_y = max_widget_y + max_widget_y_height;
        addWidget_chart(option,0,max_widget_y);
        WORKBENCH_EVENT_CHANGE_LISTENER();
    }
}






// *******Server Side Retrieve Data JS Code*******
var retrieveData_chart = function (page) {
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
    if (!genericModalViewModel) {
        return;
    }
    genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", "SERVICE 'GENERIC CUD' FAILED! Please contact with the system admin for more information...");
}

function failedListener_chart() {
    if (!genericModalViewModel) {
        return;
    }
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].errorMessage;
        genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", errorMessage);
    }
}

function successListener_chart() {
    if (!genericModalViewModel) {
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












// function modal_env_setup() {
//   modal_vm_env_setup();
//   modal_search_env_setup();
//   modal_scroll_env_setup();
// }
//
// // Setup the business model with view model
// function modal_vm_env_setup() {
//
//   // *******YOUR SHOULD CODING IN HERE:*******
//   // function BusinessPOJO() {
//   //   var self = this;
//   //   self.elements = new ServerPagingViewModel();
//   // }
//   var businessPOJO = new GenericBusinessPOJO();
//   genericModalViewModel.businessPOJO(businessPOJO);
// }
//
// function modal_search_env_setup() {
//   SearchPOJO.listener = default_search_data;
//   SearchPOJO.likeOrMap = ["username", "stringalpha"];
//   SearchPOJO.sortKey = ['id'];
//   SearchPOJO.build_requestPOJO_prototype = modal_build_requestPOJO_prototype;
// }
//
// function modal_build_requestPOJO_prototype() {
//   var result = {
//     "className": "Share",
//     "orderMap": {
//       "id": false
//     },
//     "pageMaxSize": ScrollPOJO.pageMaxSize,
//     "currentPageNumber": ScrollPOJO.page || 1,
//     "eqMap": {
//       "type": "MATRIX_CHART",
//       "deleted": false
//     },
//     "inMap": {},
//   };
//
//   return result;
// }
//
//
// function modal_scroll_env_setup() {
//   ScrollPOJO.listener = default_retrive_api;
//   ScrollPOJO.reset();
//   ScrollPOJO.setup();
// }
//
//
//
//
// $.subscribe("MATRIX_API_SUCCESS_EVENT", MATRIX_API_SUCCESS_EVENT_HANDLER);
//
// function MATRIX_API_SUCCESS_EVENT_HANDLER() {
//   if (arguments && arguments[1]) {
//     var response = arguments[1];
//     var addtion = null;
//     if (arguments[1].response) {
//       response = arguments[1].response;
//       addtion = arguments[1].addtion;
//     }
//     if (response.result) {
//       var data = response.result;
//       if (addtion) {
//         if (addtion['TAG'] == 'MATRIX_SEARCH') {
//           //MATRIX SEARCH DEFAULT HANDLER
//           if (genericModalViewModel.businessPOJO() && genericModalViewModel.businessPOJO().elements) {
//             ScrollPOJO.displayResult = ScrollPOJO.displayResult.concat(data);
//             if (data.length < ScrollPOJO.pageMaxSize) {
//               ScrollPOJO.hasNewData = false;
//             }
//             var results = ScrollPOJO.displayResult.sort(SearchPOJO.sort);
//             genericModalViewModel.businessPOJO().elements.viewData(results);
//           }
//         }
//       }
//     }
//   }
// }
