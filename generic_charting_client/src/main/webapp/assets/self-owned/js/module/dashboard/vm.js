var tmp;
function DashboardViewModel(parent) {
  var self = this;
  self.data = null;
  self.parent = parent;
  self.cells = ko.observableArray();
  self.name = ko.observable();
  self.hasNewContent = ko.observable(false);

  self.reset = function() {
    self.data = null;
    self.name();
    self.hasNewContent(true);
    cleanWidget();
  };

  self.serialize_dashboard = function() {
    var result = {
      'name':null,
      'data':null
    };
    WorkbenchCache.updateCache();
    var persist_data = WorkbenchCache.array_elements;
    result.data = persist_data;
    result.name = self.name();
    var json = ko.toJSON(result);
    console.log(json);
    tmp = json;
    return json;
  }

  self.deserialize_dashboard = function(inputData) {
    self.data = inputData;

    var json = inputData.json;
    var result = $.parseJSON(json);
    self.name(inputData.stringalpha);
    if(result.data){
      cleanWidget();
      $.each(result.data,function(index,value){
        if(value.widget_id){
          var widget = value.widget_element;
          if(widget.isChart){
            var content = $.parseJSON(widget.data);
            var chart = addWidget_chart(content,widget.widget_x,widget.widget_y,widget.widget_width,widget.widget_height);
          }else{
            var content = deserialize_dom(widget.data);
            add_content_div(content,widget.widget_x,widget.widget_y,widget.widget_width,widget.widget_height)
          }
        }
      })
    }
  }


  self.persist2server = function() {
    //'type': 'MATRIX_DASHBOARD'
    //'tag': SAVE,SHARE
    var shareJson = {
      'type': 'MATRIX_DASHBOARD',
      'tag': 'SAVE',
      'json': self.serialize_dashboard(),
      'stringalpha': 'report draft demo',
      'username': UserPOJO.user.userName
    }
    var data = {
      'shareJson': $.toJSON(shareJson)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/generate/' + 10000, data, "TOKEN_SUCCESS", "TOKEN_FAILED", "TOKEN_SERVICE_FAILED");
  }
}



$.subscribe("TOKEN_SUCCESS", successListener);
$.subscribe("TOKEN_FAILED", failedListener);
$.subscribe("TOKEN_SERVICE_FAILED", failedServiceListener);

function successListener() {
  if (arguments && arguments[1]) {
    console.log("Save operation successed");
    console.log(arguments[1]);
    var token = arguments[1].result[0]; //ab38e4a4ede0768a8e1b8bde73b3e7a6a893d048a0f3882a68217733ce314240
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
