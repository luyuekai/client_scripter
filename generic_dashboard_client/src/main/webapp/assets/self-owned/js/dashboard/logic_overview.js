var vm = new GenericPageViewModel();
//Clean Data Bind Node for dynamic table
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
current_vm = vm;

function env_setup() {
  vm_env_setup();
  query_chain_env_setup();
  statistic_charts_env_setup();
}


// Setup the business model with view model
function vm_env_setup() {
  var businessPOJO = new BusinessPOJO();
  vm.businessPOJO(businessPOJO);
}

function query_chain_env_setup() {
  var statistic_self_saved_dashboard={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "username": UserPOJO.user.userName,
        "type": "MATRIX_DASHBOARD",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  var statistic_self_shared_dashboard={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "username": UserPOJO.user.userName,
        "type": "MATRIX_DASHBOARD",
        "tag": "SHARE",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  var statistic_all_shared_dashboard={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "type": "MATRIX_DASHBOARD",
        "tag": "SHARE",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  QueryChainPOJO.queryArray = [];
  QueryChainPOJO.queryArray.push({'id':1,'tag':'statistic_self_saved_dashboard','query':statistic_self_saved_dashboard});
  QueryChainPOJO.queryArray.push({'id':2,'tag':'statistic_self_shared_dashboard','query':statistic_self_shared_dashboard});
  QueryChainPOJO.queryArray.push({'id':3,'tag':'statistic_all_shared_dashboard','query':statistic_all_shared_dashboard});
  $.subscribe("query_chain_finished", statistic_result_listener);
  QueryChainPOJO.query();

}


function statistic_result_listener() {
  if (vm && vm.businessPOJO()) {
    var results = QueryChainPOJO.queryResults;
    $.each(results, function(index, value) {
      if (value.query.tag == 'statistic_self_saved_dashboard') {
        vm.businessPOJO().self_saved_counts(value.response.totalCounts);
      }
      if (value.query.tag == 'statistic_self_shared_dashboard') {
        vm.businessPOJO().self_shared_counts(value.response.totalCounts);
      }
      if (value.query.tag == 'statistic_all_shared_dashboard') {
        vm.businessPOJO().total_shared_counts(value.response.totalCounts);
      }
    });
  }
}


function statistic_charts_env_setup() {
  setTimeout(function(){
    create_dynamic_chart_pie(ds_statistic_by_date, 'copy_chart_parent_div1');
    create_dynamic_chart_pie(ds_statistic_by_business, 'copy_chart_parent_div2');
    create_dynamic_chart_pie(ds_statistic_by_user, 'copy_chart_parent_div3');
  }, 600);
}


var ds_statistic_by_date = {
  "ds": "http://localhost:8080/service_generic_query/api/query",
  "header_json": "[{\"data\":\"SUM_NUMBER\",\"index\":0,\"isChecked\":true,\"isDisplay\":true},{\"data\":\"CREATE_TIME\",\"index\":1,\"isChecked\":true,\"isDisplay\":true}]",
  "refresh_interval": "60",
  "json_rule": "result",
  "rest_mode": "POST",
  "request_params": "{\"queryJson\":\"{\\\"className\\\":\\\"Share\\\",\\\"groupMap\\\":{\\\"stringalpha\\\":\\\"stringalpha\\\"},\\\"pageMaxSize\\\":100000,\\\"currentPageNumber\\\":1,\\\"eqMap\\\":{\\\"type\\\":\\\"MATRIX_DASHBOARD\\\",\\\"deleted\\\":false}}\"}",
  "pageMaxSize": 10,
  "mock": false
};

var ds_statistic_by_user = {
  "ds": "http://localhost:8080/service_generic_query/api/query",
  "header_json": "[{\"data\":\"SUM_NUMBER\",\"index\":0,\"isChecked\":true,\"isDisplay\":true},{\"data\":\"USER\",\"index\":1,\"isChecked\":true,\"isDisplay\":true}]",
  "refresh_interval": "60",
  "json_rule": "result",
  "rest_mode": "POST",
  "request_params": "{\"queryJson\":\"{\\\"className\\\":\\\"Share\\\",\\\"groupMap\\\":{\\\"username\\\":\\\"username\\\"},\\\"pageMaxSize\\\":100000,\\\"currentPageNumber\\\":1,\\\"eqMap\\\":{\\\"type\\\":\\\"MATRIX_DASHBOARD\\\",\\\"deleted\\\":false}}\"}",
  "pageMaxSize": 10,
  "mock": false
};

var ds_statistic_by_business = {
  "ds": "http://localhost:8080/service_generic_query/api/query",
  "header_json": "[{\"data\":\"SUM_NUMBER\",\"index\":0,\"isChecked\":true,\"isDisplay\":true},{\"data\":\"BUSINESS_STATUS\",\"index\":1,\"isChecked\":true,\"isDisplay\":true}]",
  "refresh_interval": "60",
  "json_rule": "result",
  "rest_mode": "POST",
  "request_params": "{\"queryJson\":\"{\\\"className\\\":\\\"Share\\\",\\\"groupMap\\\":{\\\"id\\\":\\\"id\\\"},\\\"pageMaxSize\\\":100000,\\\"currentPageNumber\\\":1,\\\"eqMap\\\":{\\\"type\\\":\\\"MATRIX_DASHBOARD\\\",\\\"deleted\\\":false}}\"}",
  "pageMaxSize": 10,
  "mock": false
};
