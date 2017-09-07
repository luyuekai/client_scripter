/**
 * View Model for the whole DOM, it holds the whole elements
 *
 */
function ReportViewModel() {
  var self = this;

  self.data = null;
  self.template = null;
  self.name = ko.observable();
  self.hasNewContent = ko.observable(false);
  self.will_block=ko.observable(false);         //正在下载时block操作区。这个字段表征是否要被block
  self.template_name = ko.observable();
  self.active_cell = null;

  self.cut_cell = null;

  self.copy_cell = null;

  self.cells = ko.observableArray();

  self.addCell = function() {
    var cell = new CellViewModel(self);
    var cell_id = (new Date()).getTime() + "_cell";
    cell.div_id(cell_id);
    // self.cells.push(cell);
    if (self.active_cell) {
      var index = self.cells.indexOf(self.active_cell);
      self.cells.splice(index + 1, 0, cell);
    } else {
      self.cells.push(cell);
    }

    cell.listener_focus_in();
    self.hasNewContent(true);
  };
//  self.compileCell = function() {
//    if (self.active_cell) {
//      self.active_cell.compile();
//    }
//    self.hasNewContent(true);
//  }

  self.inactive_cells = function() {
    $.each(self.cells(), function(index, cell) {
      if (cell) {
        cell.isActive(false);
      }
    });
    self.active_cell = null;
  }
//  self.deserialize_json = function(json) {
//    var report = $.parseJSON(json);
//    self.cells.removeAll();
//    $.each(report.cells, function(idx, cellShareModel) {
//      var cell = self.buildCell(cellShareModel);
//      self.cells.push(cell);
//    });
//    self.refreshCellsStatus();
//  }

  self.deserialize_report = function(inputData) {
    var json = inputData.json;
    var codejson = inputData.codejson;
    self.data = inputData;
    self.name(inputData.stringalpha);
    var report = $.parseJSON(json);
    self.cells.removeAll();
    $.each(report.cells, function(idx, cellShareModel) {
      var cell = self.buildCell(cellShareModel);
      self.cells.push(cell);
    });
    var codecells = $.parseJSON(codejson);
    $.each(codecells.cells,function (idx,cell){
        var templatecell = new CellViewModel(self);
        templatecell.isViewMode(true);
        templatecell.div_id(cell.div_id);
        templatecell.code_source(cell.code_source);
        templatecell.code_compiled(cell.code_source);
        templatecell.isActive(false);
        templatecell.isChartMode(false);
        self.cells.push(templatecell);
//        console.log(templatecell.div_id());
    });
//
//    self.refreshCellsStatus();
//    self.inactive_cells();
//    console.log(self.cells());
  }


  self.buildCell = function(model) {

    var cell = new CellViewModel(self);
    cell.div_id(model.div_id);

    cell.code_source(model.code_source);

    cell.code_compiled(model.code_source); // 未complie状态使用其source

    cell.isActive(false);

    cell.isViewMode(true); //所有的全是viewmodel,没有editmodel

    cell.isChartMode(model.isChartMode);

    if (cell.isChartMode) {
      cell.chartJson = model.chartJson;
    }
    return cell;
  }

//  self.refreshCellsStatus = function() {
//
//    $.each(self.cells(), function(idx, cell) {
//      if (!cell.isViewMode()) {
//        cell.listener_dbl_click();
//      }
//      if (cell.isChartMode() && cell.chartJson) {
//        var chart_div_id = cell.chart_div_id();
//        var option = ChartPOJO.deserialize_chart_option(cell.chartJson);
//        var chart = ChartPOJO.renderChart(chart_div_id, option);
//        cell.chart = chart;
//      }
//    });
//  }

}

function CellViewModel(parent) {
  var self = this;

  self.parent = parent;

  self.div_id = ko.observable();

  self.edit_div_id = ko.pureComputed(function() {
    if (self.div_id()) {
      return self.div_id() + "_edit";
    }
  }, self);

  self.chart_div_id = ko.pureComputed(function() {
    if (self.div_id()) {
      return self.div_id() + "_chart";
    }
  }, self);

  self.code_source = ko.observable("Please double click the cell to edit the content...");

  self.code_compiled = ko.observable("Please double click the cell to edit the content...");

  self.editor_CodeMirror = null;

  self.isActive = ko.observable(true);

  self.isViewMode = ko.observable(true);

  self.chart = null;
  self.chartJson = null;
  self.chartBase64Encode = null;
  self.isChartMode = ko.observable(false);


  self.currentStyle = ko.pureComputed(function() {

    var result = "compile_mode_focus_out";

    if (self.isViewMode()) {
      if (self.isActive()) {
        result = "compile_mode_focus_in";
      } else {
        result = "compile_mode_focus_out";
      }
    } else {
      if (self.isActive()) {
        result = "edit_mode_focus_in";
      } else {
        result = "edit_mode_focus_out";
      }
    }
    return result;
  }, self);

  self.listener_focus_in = function() {
    parent.inactive_cells();
    parent.active_cell = self;
    self.isActive(true);
  }
  self.listener_focus_out = function() {}
// self.listener_dbl_click = function() {
//    // if the cell is in view mode, switch to edit mode
////    if (self.isViewMode()) {
////      self.isViewMode(false);
////    }
//    // if the code mirror edit is not initialized, initialize it
//    if (!self.editor_CodeMirror) {
//      self.create_codeMirror_component();
//    }
//    self.parent.hasNewContent(true);
//  }
//  self.compile = function() {
//    if (self.isViewMode()) {
//      return;
//    }
//
//    if (self.editor_CodeMirror) {
//      var markdown_content = self.editor_CodeMirror.getValue();
//      // var compile_code = markdown.toHTML(markdown_content);
//      var compile_code = converter.makeHtml(markdown_content);
//      self.code_compiled(compile_code);
//      self.code_source(markdown_content);
//
//      //delete code mirror textarea
//      self.editor_CodeMirror = null;
//      $("#" + self.div_id()).find(".CodeMirror").remove();
//      self.isViewMode(true);
//    }
//  }



//  self.create_codeMirror_component = function() {
//    if (!self.div_id()) {
//      return;
//    }
//    var editor = CodeMirror.fromTextArea(document.getElementById(self.edit_div_id()), {
//      mode: 'markdown',
//      lineNumbers: false,
//      theme: "default",
//      lineWrapping:true, // 不滚动
//      extraKeys: {
//        "Enter": "newlineAndIndentContinueMarkdownList"
//      }
//    });
//    editor.on('focus', function() {
//      self.listener_focus_in();
//    });
//    editor.on('change', function() {
//      if(!self.parent.hasNewContent()){
//        self.parent.hasNewContent(true);
//      }
//    });
//    self.editor_CodeMirror = editor;
//  }
}


function CellShareModel() {
  var self = this;
  self.div_id = null;
  self.edit_div_id = null;
  self.code_source = null;
  self.code_compiled = null;
  self.isActive = false;
  self.isViewMode = false;
  self.isChartMode = false;
  self.chartJson = null;
  self.chartBase64Encode = null;
  self.currentStyle = null;
}
