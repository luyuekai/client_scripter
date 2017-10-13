/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function OdaCodeViewModel(){
    var self= this;
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
}