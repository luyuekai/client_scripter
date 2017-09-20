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
  };

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
            var cont = deserialize_dom(widget.data);
            add_content_div(cont,widget.widget_x,widget.widget_y,widget.widget_width,widget.widget_height);
          }
        }
      });
    }
  };


  self.persist2server = function() {
    //'type': 'MATRIX_DASHBOARD'
    //'tag': SAVE,SHARE
    var shareJson = {
      'type': 'MATRIX_DASHBOARD',
      'tag': 'SAVE',
      'json': self.serialize_dashboard(),
      'stringalpha': 'report draft demo',
      'username': UserPOJO.user.userName
    };
    var data = {
      'shareJson': $.toJSON(shareJson)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/generate/' + 10000, data, "TOKEN_SUCCESS", "TOKEN_FAILED", "TOKEN_SERVICE_FAILED");
  };
}
