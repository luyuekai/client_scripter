function initialize() {
  $(window).bind('scroll', function() {
    ScrollPOJO.scrollListener();
  });
  // retrieveData(1);
  ScrollPOJO.listener();
}

var search_saved_self = function() {
  ScrollPOJO.reset();
  retrieveData_saved_self();
}

var search_shared_self = function() {
  ScrollPOJO.reset();
  retrieveData_shared_self();
}
var search_shared_all = function() {
  ScrollPOJO.reset();
  retrieveData_shared_all();
}

var search_template_all = function() {
  ScrollPOJO.reset();
  retrieveData_template_all();
}


// *******Server Side Retrieve Data JS Code*******
var retrieveData_saved_self = function() {
  var keyword = SearchPOJO.keywords;
  var likeOrMap = {};
  if (keyword) {
    likeOrMap = {
      "stringalpha": keyword
    }
  }
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "likeORMap": likeOrMap,
    "eqMap": {
      "username": UserPOJO.user.userName,
      "type": "MATRIX_REPORT_DRAFT",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };

  console.log(JSON.stringify(data));
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "SEARCH_SUCCESS_LISTENER", "PAGING_SEARCH_FAILED", "SERVICE_GENERIC_QUERY_FAILED");
}

var retrieveData_shared_self = function() {
  var keyword = SearchPOJO.keywords;
  var likeOrMap = {};
  if (keyword) {
    likeOrMap = {
      "stringalpha": keyword
    }
  }
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "likeORMap": likeOrMap,
    "eqMap": {
      "username": UserPOJO.user.userName,
      "type": "MATRIX_REPORT_DRAFT",
      "tag":"SHARE",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };
  console.log(JSON.stringify(data));
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "SEARCH_SUCCESS_LISTENER", "PAGING_SEARCH_FAILED", "SERVICE_GENERIC_QUERY_FAILED");
}

var retrieveData_shared_all = function() {
  var keyword = SearchPOJO.keywords;
  var likeOrMap = {};
  if (keyword) {
    likeOrMap = {
      "stringalpha": keyword
    }
  }
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "likeORMap": likeOrMap,
    "eqMap": {
      "type": "MATRIX_REPORT_DRAFT",
      "tag":"SHARE",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };
  console.log(JSON.stringify(data));
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "SEARCH_SUCCESS_LISTENER", "PAGING_SEARCH_FAILED", "SERVICE_GENERIC_QUERY_FAILED");
}

var retrieveData_template_all = function() {
  var keyword = SearchPOJO.keywords;
  var likeOrMap = {
    "stringbeta":'TEMPLATE'
  };
  if (keyword) {
    likeOrMap = {
      "stringalpha": keyword,
      "stringbeta":'TEMPLATE'
    }
  }
  var requestPOJO = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "likeORMap": likeOrMap,
    "eqMap": {
      "type": "MATRIX_REPORT_DRAFT",
      "tag":"SHARE",
      "deleted": false
    },
    "inMap": {},
  };
  var data = {
    'queryJson': $.toJSON(requestPOJO)
  };
  console.log(JSON.stringify(data));
  $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "SEARCH_SUCCESS_LISTENER", "PAGING_SEARCH_FAILED", "SERVICE_GENERIC_QUERY_FAILED");
}

// *******Server Side Retrieve Data Listener JS Code*******
$.subscribe("SEARCH_SUCCESS_LISTENER", successListener);
$.subscribe("PAGING_SEARCH_FAILED", failedListener);
$.subscribe("SERVICE_GENERIC_QUERY_FAILED", failedServiceListener);

function failedServiceListener() {
  responseViewModel.errorResponse("SERVICE 'GENERIC QUERY' FAILED! Please contact with the system admin for more information...")
}

function failedListener() {
  if (arguments && arguments[1]) {
    var errorMessage = arguments[1].errorMessage;
    responseViewModel.errorResponse(errorMessage)
  }
}

function successListener() {
  if (arguments && arguments[1]) {
    // var headers = AlgorithmPOJO.buildKeys(arguments[1].result);
    // viewModel.buildSearchData(arguments[1]);
    console.log(arguments[1]);
    var data = arguments[1].result;
    ScrollPOJO.displayResult = ScrollPOJO.displayResult.concat(data);
    //    console.log(data.length);
    if (data.length < ScrollPOJO.pageMaxSize) {
      ScrollPOJO.hasNewData = false;
    }
    var results = ScrollPOJO.displayResult.sort(sortTime);

    viewModel.viewData(results);
  }
}

function sortTime(a, b) {
  return b.createtime - a.createtime;
}

function redirect2editor(currentData) {
  if (currentData && currentData.token) {
    window.open($.getRootPath() + '/module_report_editor.html?token=' + currentData.token);
  }
}

function redirect2viewer(currentData) {
  if (currentData && currentData.token) {
    window.open($.getRootPath() + '/module_report_viewer.html?token=' + currentData.token);
  }
}
