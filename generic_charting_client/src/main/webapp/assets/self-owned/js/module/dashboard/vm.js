function DashboardViewModel(parent) {
  var self = this;
  self.data = null;
  self.parent = parent;
  self.cells = ko.observableArray();
  self.name = ko.observable();
  self.hasNewContent = ko.observable(false);
  self.serialize_dashboard = function() {
    var result = {
      cells: []
    };
    $.each(self.cells(), function(idx, cell) {
      var cellShareModel = cell.buildShareModel();
      result.cells.push(cellShareModel);
    });

    return ko.toJSON(result);
  }

  self.deserialize_dashboard = function(inputData) {
    var json = inputData.json;
    self.data = inputData;
    var result = $.parseJSON(json);

    self.cells.removeAll();
    $.each(result.cells, function(idx, cellShareModel) {
      var cell = self.buildCell(cellShareModel);
      self.cells.push(cell);
    });
  }
  self.buildCell = function(model) {
    var cell = new CellViewModel(self);
    cell.cell_attributes = model.cell_attributes;
    cell.cell_data = model.cell_data;
    return cell;
  }

  self.persist2server = function() {
    //'type': 'MATRIX_DASHBOARD'
    //'tag': SAVE,SHARE
    var shareJson = {
      'type': 'MATRIX_DASHBOARD',
      'tag': 'SAVE',
      'json': self.serialize_report(),
      'stringalpha': 'report draft demo',
      'username': UserPOJO.user.userName
    }
    var data = {
      'shareJson': $.toJSON(shareJson)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/generate/' + 10000, data, "TOKEN_SUCCESS", "TOKEN_FAILED", "TOKEN_SERVICE_FAILED");
  }
}

function CellViewModel(parent) {
  var self = this;
  self.parent = parent;
  self.cell_attributes = null;
  self.cell_data = null;
  self.buildShareModel = function() {
    var model = new CellShareModel();
    model.cell_attributes = self.cell_attributes;
    model.cell_data = self.cell_data;
    return model;
  }
}

function CellShareModel() {
  var self = this;
  self.cell_attributes = null;
  self.cell_data = null;
}


var prototype_cell_attributes = {
  id: 'id_prototype_cell_attributes',
  x: 0,
  y: 0,
  width: 6,
  height: 5
};

var prototype_cell_data = {
  id: 'prototype_cell_data',
  data: null
}

$.subscribe("TOKEN_SUCCESS", successListener);
$.subscribe("TOKEN_FAILED", failedListener);
$.subscribe("TOKEN_SERVICE_FAILED", failedServiceListener);

function successListener() {
  if (arguments && arguments[1]) {
    console.log("Save operation successed");
    // console.log(arguments);
    // genericModalViewModel.response(true, "保存操作", "[成功]", "");
  }
}

function failedListener() {
  if (arguments && arguments[1]) {
    console.log("Save operation failed");
    // var errorMessage = arguments[1].errorMessage;
    // genericModalViewModel.response(false, "保存操作", "[失败]", errorMessage);
  }
}

function failedServiceListener() {
  // genericModalViewModel.response(false, "保存操作", "[失败]", "服务器异常！请联系管理员解决。");
  console.log("Save operation service failed");
}
