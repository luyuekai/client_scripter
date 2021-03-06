$.subscribe("get_user_detail_chain_finished", environment_check);

function environment_check(){
  initialize_statistic();
}

function initialize_statistic() {
  var statistic_self_saved={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "username": UserPOJO.user.userName,
        "type": "MATRIX_REPORT_DRAFT",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  var statistic_self_shared={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "username": UserPOJO.user.userName,
        "type": "MATRIX_REPORT_DRAFT",
        "tag": "SHARE",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  var statistic_all_shared={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "eqMap": {
        "type": "MATRIX_REPORT_DRAFT",
        "tag": "SHARE",
        "deleted": false
      },
      "inMap": {},
      "orderMap": {
        "id": false
      }
    })
  };

  var statistic_all_template={
    'queryJson': $.toJSON({
      "className": "Share",
      "pageMaxSize": 10,
      "currentPageNumber": 1,
      "likeORMap": {
        "stringbeta": 'TEMPLATE'
      },
      "eqMap": {
        "type": "MATRIX_REPORT_DRAFT",
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
  QueryChainPOJO.queryArray.push({'id':1,'tag':'statistic_self_saved','query':statistic_self_saved});
  QueryChainPOJO.queryArray.push({'id':2,'tag':'statistic_self_shared','query':statistic_self_shared});
  QueryChainPOJO.queryArray.push({'id':3,'tag':'statistic_all_shared','query':statistic_all_shared});
  QueryChainPOJO.queryArray.push({'id':4,'tag':'statistic_all_template','query':statistic_all_template});
  $.subscribe("query_chain_finished", statistic_result_listener);
  QueryChainPOJO.query();

}

var statistic_result_listener = function() {
  var results = QueryChainPOJO.queryResults;
  $.each(results,function(index,value){
    if(value.query.tag=='statistic_self_saved'){
      viewModel.self_saved_counts(value.response.totalCounts);
      var tableModel = new ServerPagingViewModel();
      tableModel.buildSearchData(value.response);
      viewModel.self_saved_top10(tableModel);
    }
    if(value.query.tag=='statistic_self_shared'){
      viewModel.self_shared_counts(value.response.totalCounts);
      var tableModel = new ServerPagingViewModel();
      tableModel.buildSearchData(value.response);
      viewModel.self_shared_top10(tableModel);
    }
    if(value.query.tag=='statistic_all_shared'){
      viewModel.total_shared_counts(value.response.totalCounts);
      var tableModel = new ServerPagingViewModel();
      tableModel.buildSearchData(value.response);
      viewModel.all_saved_top10(tableModel);
    }
    if(value.query.tag=='statistic_all_template'){
      viewModel.total_template_counts(value.response.totalCounts);
      var tableModel = new ServerPagingViewModel();
      tableModel.buildSearchData(value.response);
      viewModel.all_template_top10(tableModel);
    }
  })
}

function redirect2editor(currentData) {
  if (currentData && currentData[6]) {
    window.open($.getRootPath() + '/module_report_editor.html?token=' + currentData[6]);
  }
}

function redirect2viewer(currentData) {
  if (currentData && currentData[6]) {
    window.open($.getRootPath() + '/module_report_viewer.html?token=' + currentData[6]);
  }
}
