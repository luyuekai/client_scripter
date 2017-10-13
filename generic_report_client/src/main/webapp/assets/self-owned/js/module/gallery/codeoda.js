/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function OdaCodeViewModel(){
    var self= this;
    // for result
    self.hasResult= ko.observable(false);
    self.styleClass=  ko.observable("alert-success");
    self.resultTitle=  ko.observable("Result Title");
    self.resultSubTitle=  ko.observable("Sub Title");
    self.resultContent=  ko.observable("Content...");
    
    self.response = function(successFlag,resultTitle,resultSubTitle,resultContent){
    self.hasResult(true);
    self.resultTitle(resultTitle);
    if(successFlag){
      self.styleClass("alert-success");
    }else{
      self.styleClass("alert-danger");
    }
    self.resultSubTitle(resultSubTitle);
    self.resultContent(resultContent);
  }
    
    self.data=null;
    self.active_cell=null;
    self.cells = ko.observableArray();
    self.addCell = function(){
        var cell=new CodeViewModel(self);
        var cell_id = (new Date()).getTime()+"_cell";
        cell.div_id(cell_id);
        if (self.active_cell) {
        var index = self.cells.indexOf(self.active_cell);
        self.cells.splice(index + 1, 0, cell);
        } else {
          self.cells.push(cell);
        }
      var editor = CodeMirror.fromTextArea(document.getElementById(cell.div_id()), {
      mode: "text/x-hive",
      lineNumbers: false,
      theme: "default",
      lineWrapping:true, // 不滚动
      extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
      }
    });
//    editor.focus();
editor.setSize('auto', 'auto');
    editor.on('focus', function() {
      cell.listener_focus_in();
    });
    cell.editor_CodeMirror = editor;
    }
    self.removeCell = function(){
        if (!self.active_cell) {
      return;
    }
//    var index = self.cells.indexOf(self.active_cell);

//    var nearest_cell = self.cells().length == index + 1 ? (index == 0 ? null : self.cells()[index - 1]) : self.cells()[index + 1];

    self.cells.remove(self.active_cell);
    }
    self.inactive_cells = function() {
    $.each(self.cells(), function(index, cell) {
      if (cell) {
        cell.isActive(false);
      }
    });
    self.active_cell = null;
  }
  self.serialize_code = function() {
    var report = {
      cells: []
    };
    var model = new CellModel();
    model.div_id=(new Date()).getTime()+"_cell";
    model.code_source="-----------------注意：以下为代码区--------------";
    report.cells.push(model);
    $.each(self.cells(), function(idx, cell) {
      var cellModel = cell.buildModel();
      report.cells.push(cellModel);
    });

    return ko.toJSON(report);
  }
  
}
function CodeViewModel(parent){
    var self = this;
    self.parent = parent;
    self.div_id = ko.observable();
    self.editor_CodeMirror = null;
    self.isActive = ko.observable(true);
    self.code_source = ko.observable("");
    self.listener_focus_in = function() {
        parent.inactive_cells();
        parent.active_cell = self;
        self.isActive(true);
  }
  
  self.buildModel = function() {
    var model = new CellModel();
    model.div_id = self.div_id();
    if (self.editor_CodeMirror) {
      var markdown_content = self.editor_CodeMirror.getValue();
      self.code_source(markdown_content);
      model.code_source = self.code_source();
      return model;
    }

}
}
function CellModel() {
  var self = this;
  self.div_id = null;
  self.code_source = null;
}