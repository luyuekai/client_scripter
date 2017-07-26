// *******Data Bind JS Code*******
// Initialize Generic Page View Model as entire page data bind parent element
var vm = new GenericPageViewModel();
// Clean Data Bind Node
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
current_vm = vm;

function env_setup() {
  vm_env_setup();
}


// Setup the business model with view model
function vm_env_setup() {

  // *******YOUR SHOULD CODING IN HERE:*******
  function BusinessPOJO() {
    var self = this;

    //---------------------------------------------
    self.id = ko.observable(); // id
    self.name = ko.observable(); //Data Source Name
    self.description = ko.observable(); //Data Source Description
    self.creator = ko.observable(); //Author Unique Flag
    self.createtime = ko.observable((new Date()).getTime()); //Create Time
    self.formatTime = ko.computed(function() {
      return UtilPOJO.formatTime(self.createtime(), 'yyyy-MM-dd');
    }, this);
    self.lastupdatetime = ko.observable(); //Last Update Time
    self.stringzeta = ko.observable(); //Data Source Setting
    self.type = ko.observable('GENERIC_MATRIX_DATA_SOURCE');

    self.stringzeta_ds = ko.observable();
    self.stringzeta_header_json = ko.observable();
    self.stringzeta_refresh_interval = ko.observable('30');
    self.stringzeta_json_rule = ko.observable();
    self.stringzeta_rest_mode = ko.observable('POST');
    self.stringzeta_request_params = ko.observable();
    self.stringzeta_pageMaxSize = ko.observable();
    self.stringzeta_mock = ko.observable(false);

    self.stringzeta_ds_response = ko.observable('');
    self.stringzeta_ds_response_data = null;

    self.showTable = ko.observable(false);
    self.tableModel = ko.observable(new ThinListViewModel());

    self.build_requestPOJO = function(){
      self.createtime((new Date()).getTime());
      var requestPOJO = {
          "className": "v2.service.generic.query.entity.Genericentity",
          "attributes": {
              "name": self.name(),
              "description": self.description(),
              "creator": self.creator(),
              "createtime": self.createtime(),
              "lastupdatetime": self.lastupdatetime(),
              "stringzeta": self.stringzeta(),
              "type": self.type(),
              "enabled": true,
              "valid": true,
              "deleted": false,
          }
      };
      return requestPOJO;
    }

    self.ds = ko.computed(function() {
      var json = {
        'ds': self.stringzeta_ds(),
        'header_json': self.tableModel().header2json(),
        'refresh_interval': self.stringzeta_refresh_interval(),
        'json_rule': self.stringzeta_json_rule(),
        'rest_mode': self.stringzeta_rest_mode(),
        'request_params':self.stringzeta_request_params() || null,
        'pageMaxSize':self.tableModel().pageMaxSize(),
        'mock':self.stringzeta_mock()
      }
      return JSON.stringify(json);
    });
  }

  var businessPOJO = new BusinessPOJO();
  businessPOJO.creator(UserPOJO.user.userName);
  vm.businessPOJO(businessPOJO);
};

// *******YOUR SHOULD CODING IN HERE:*******
var businessValidation = function() {
  var errorMessages = [];
  //validate logic...

  //validate
  ValidationPOJO.validate("Creator", vm.businessPOJO().creator(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Create Time", vm.businessPOJO().createtime(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Data Source Name", vm.businessPOJO().name(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Data Source URI", vm.businessPOJO().stringzeta_ds(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Data Source Rest Mode", vm.businessPOJO().stringzeta_rest_mode(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Data Source Refresh Interval", vm.businessPOJO().stringzeta_refresh_interval(), errorMessages, ['KEY_NOT_NULL']);
  ValidationPOJO.validate("Data Source Header", vm.businessPOJO().stringzeta_header_json(), errorMessages, ['KEY_NOT_NULL']);

  return errorMessages;
}

// *******YOUR SHOULD CODING IN HERE:*******
var runService = function() {
  // default_add_logic();
}


$.subscribe("MATRIX_API_SUCCESS_EVENT", MATRIX_API_SUCCESS_EVENT_HANDLER);

function MATRIX_API_SUCCESS_EVENT_HANDLER() {
  if (arguments && arguments[1]) {
    if(arguments[1].addtion && arguments[1].addtion['TAG']=='MATRIX_DATA_SOURCE_TESTING'){
      console.log(arguments[1]);
      console.log("Retrieve Data Source Successed!")
      var server_data = arguments[1].response;
      var res = JSON.stringify(arguments[1].response);
      vm.businessPOJO().stringzeta_ds_response(res);
      vm.businessPOJO().stringzeta_ds_response_data = server_data;
    }
  }
}


var check_data_source = function() {
  if (!vm.validation(function(){
    var errorMessages = [];
    //validate
    ValidationPOJO.validate("Data Source", vm.businessPOJO().stringzeta_ds(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Rest Mode", vm.businessPOJO().stringzeta_rest_mode(), errorMessages, ['KEY_NOT_NULL']);
    return errorMessages;
  })) {
    return;
  } else {
    // validation correct
    // do your business...
    var data = vm.businessPOJO().stringzeta_request_params() || null;
    var mode = vm.businessPOJO().stringzeta_rest_mode();
    if(data){
      data = JSON.parse(data);
    }
    $.serverRequest(vm.businessPOJO().stringzeta_ds(), data, "DEFAULT_RETRIEVE_API_SUCCESS_LISTENER", "DEFAULT_RETRIEVE_API_FAILED_LISTENER", "DEFAULT_RETRIEVE_API_EXCEPTION_LISTENER", mode, true, {'TAG':'MATRIX_DATA_SOURCE_TESTING'});
  }

}

var gen_table = function() {
  var server_data = vm.businessPOJO().stringzeta_ds_response_data;

  var json_rule = vm.businessPOJO().stringzeta_json_rule();
  if (!server_data) {
    return;
  }
  if (json_rule) {
    var tmp = 'server_data.' + json_rule;
    server_data = eval(tmp);
  }
  if (!jQuery.isArray(server_data)) {
    vm.response_vm().warningResponse("The JSON fragment must be array type.", "[Generate Table]", "***Violate Validation Rules***");
    return;
  }
  var tableData = DataTransferPOJO.serverJsonData2TableData(server_data);
  var tableModel = new ThinListViewModel();
  tableModel.buildData(tableData.result);
  tableModel.columnNames(tableData.header);
  tableModel.isDisplayPager(true);
  tableModel.buildView();
  tableModel.pageMaxSize(vm.businessPOJO().tableModel().pageMaxSize());
  vm.businessPOJO().tableModel(tableModel);
  vm.businessPOJO().showTable(true);
}
