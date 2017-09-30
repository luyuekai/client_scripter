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
    data_env_setup();
    vm_env_setup();
    dynamic_table_env_setup();
}

function data_env_setup() {
    var status_lag = $.hasUrlParam('status');
    var token_flag = $.hasUrlParam('token');
    if (status_lag && token_flag) {
        var status = $.urlParamValue('status');
        var token = $.urlParamValue('token');
        if (status && token) {
            var result = {
                "className": "Genericentity",
                "orderMap": {
                    "id": false
                },
                "pageMaxSize": 10,
                "currentPageNumber": 1,
                "eqMap": {
                    "stringtheta": token,
                    "deleted": false
                },

                "inMap": {
                    "type": ["SOURCE_SQL_CONFIGURATION", "GENERIC_MATRIX_DATA_SOURCE"]
                }
            };
            var data = {
                'queryJson': $.toJSON(result)
            };
            $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "GET_DATA_SUCCESS", "GET_DATA_FAIL", "GET_DATA_SERVER_FAIL");
        }
    }
}
$.subscribe("GET_DATA_SUCCESS", reloadData)

function reloadData() {
    if (arguments && arguments[1]) {
        var result = arguments[1].result[0]
        vm.businessPOJO().reload(result)
    }
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
        self.createtime = ko.observable((new Date()).getTime()); //Create Time -- numberalpha
        self.formatTime = ko.computed(function () {
            return UtilPOJO.formatTime(self.createtime(), 'yyyy-MM-dd');
        }, this);
        self.lastupdatetime = ko.observable((new Date()).getTime()); //Last Update Time -- numberbeta
        self.formatUpdateTime = ko.computed(function () {
            return UtilPOJO.formatTime(self.lastupdatetime(), 'yyyy-MM-dd HH:mm:ss');
        }, this);
        self.stringzeta = ko.observable(); //Data Source Setting
        self.type = ko.observable('GENERIC_MATRIX_DATA_SOURCE');
        self.detailVisible = ko.observable(false);
        self.setVisible = ko.observable(false);
        self.token = hex_sha1(self.createtime + new Date().getTime());



        self.reload = function (pojo) {
            self.clear();
            self.server_data = pojo;
            self.id(pojo.id);
            self.name(pojo.name);
            self.description(pojo.description);
            self.creator(pojo.creator);
            self.createtime(pojo.numberalpha);
            self.lastupdatetime(pojo.numberbeta);
            self.stringzeta(pojo.stringzeta);
            var ds = JSON.parse(pojo.stringzeta);
            if (ds) {
                ds = ds.attr;
                self.stringzeta_ds(ds.ds);
                self.stringzeta_header_json(ds.header_json);
                self.stringzeta_refresh_interval(ds.refresh_interval);
                self.stringzeta_json_rule(ds.json_rule);
                self.stringzeta_rest_mode(ds.rest_mode);
                self.stringzeta_request_params(ds.request_params);
                self.stringzeta_pageMaxSize(ds.pageMaxSize);
                self.stringzeta_mock(ds.mock);

                check_data_source();

                reload_dynamic_table(ds);
            }
        }

        self.reload_table = function () {

            self.detailVisible(true);
            var status = $.urlParamValue('status');
            if (status == 'update') {
                self.setVisible(true)
            } else {
                self.setVisible(false);
            }
            gen_table();
            var header_model_list = self.tableModel().json2header(self.stringzeta_header_json());
            self.tableModel().headerViewData(header_model_list);
        }

        self.clear = function () {
            self.server_data = null;
            self.id(null);
            self.name(null);
            self.description(null);
            self.creator(UserPOJO.user.userName);
            self.createtime((new Date()).getTime());
            self.lastupdatetime((new Date()).getTime());
            self.stringzeta(null);
            self.stringzeta_ds(null);
            self.stringzeta_header_json(null);
            self.stringzeta_refresh_interval('30');
            self.stringzeta_json_rule(null);
            self.stringzeta_rest_mode('POST');
            self.stringzeta_request_params(null);
            self.stringzeta_ds(null);
            self.stringzeta_pageMaxSize(null);
            self.stringzeta_mock(false);
            self.stringzeta_ds_response(null);
            self.stringzeta_ds_response_data = null;
            self.showTable(false);
            self.tableModel(new ThinListViewModel());
        }

        self.stringzeta_ds = ko.observable('http://localhost:8080/service_generic_query/api/query');
        self.stringzeta_header_json = ko.observable();
        self.stringzeta_refresh_interval = ko.observable('30');
        self.stringzeta_refresh_interval_tooltip = ko.computed(function () {
            var val = self.stringzeta_refresh_interval();
            if ('10' == val) {
                return '10 Seconds'
            } else if ('30' == val) {
                return '30 Seconds'
            } else if ('60' == val) {
                return '1 Minutes'
            } else if ('300' == val) {
                return '5 Minutes'
            } else if ('3000000' == val) {
                return 'Never'
            } else {
                return 'Unknow'
            }
        });

        self.stringzeta_json_rule = ko.observable('result');
        self.stringzeta_rest_mode = ko.observable('POST');
        self.stringzeta_request_params = ko.observable('{"queryJson":"{\\"className\\":\\"Genericentity\\",\\"groupMap\\":{\\"type\\":\\"type\\"},\\"pageMaxSize\\":100,\\"currentPageNumber\\":1,\\"eqMap\\":{\\"deleted\\":false}}"}');
        self.stringzeta_request_params_max_size = ko.computed(function () {
            var val = self.stringzeta_request_params();
            var result = 'No limit';
            if (val) {
                try {
                    val = JSON.parse(val);
                    if (val.queryJson) {
                        var json = JSON.parse(val.queryJson);
                        if (json && json.pageMaxSize) {
                            result = json.pageMaxSize;
                        }
                    }
                } catch (err) {
                    vm.businessPOJO().stringzeta_ds_response('');
                    vm.response_vm().errorResponse("JSON解析失败，请检查JSON格式", "JSON解析", "[失败]");
                    setTimeout(function () {
                        vm.response_vm().reset();
                    }, 3000);
                }


            }
            return result;
        });

        self.stringzeta_pageMaxSize = ko.observable();
        self.stringzeta_mock = ko.observable(false);

        self.stringzeta_ds_response = ko.observable('');
        self.stringzeta_ds_response_data = null;

        self.showTable = ko.observable(false);
        self.tableModel = ko.observable(new ThinListViewModel());

        self.server_data = null;
        self.deleted = ko.observable(false);

        self.build_requestPOJO = function () {
            self.createtime((new Date()).getTime());
            var requestPOJO = {
                "className": "v2.service.generic.query.entity.Genericentity",
                "attributes": {
                    "name": self.name(),
                    "description": self.description(),
                    "creator": self.creator(),
                    "numberalpha": self.createtime(),
                    "numberbeta": self.lastupdatetime(),
                    // "lastupdatetime": self.lastupdatetime(),
                    "stringeta": self.formatTime(),
                    "stringtheta": self.token,
                    "stringzeta": self.ds(),
                    "type": self.type(),
                    "enabled": true,
                    "valid": true,
                    "deleted": self.deleted(),
                }
            };
            if (self.id()) {
                requestPOJO.attributes.id = self.id();
            }
            return requestPOJO;
        }

        self.ds = ko.computed(function () {
            var json = {
                'mode': 'api',
                'attr': {
                    'ds': self.stringzeta_ds(),
                    'header_json': self.tableModel().header2json(),
                    'refresh_interval': self.stringzeta_refresh_interval(),
                    'json_rule': self.stringzeta_json_rule(),
                    'rest_mode': self.stringzeta_rest_mode(),
                    'request_params': self.stringzeta_request_params() || null,
                    'pageMaxSize': self.tableModel().pageMaxSize(),
                    'mock': self.stringzeta_mock()
                }
            }
            return JSON.stringify(json);
        });


        self.data_source_table_display = ko.observable(false);
    }

    var businessPOJO = new BusinessPOJO();
    businessPOJO.creator(UserPOJO.user.userName);
    vm.businessPOJO(businessPOJO);
    var status = $.urlParamValue('status');
    var style = $.urlParamValue('style');



    if (status == null) {
        vm.businessPOJO().setVisible(true);
    } else if (status == 'check') {
        vm.businessPOJO().detailVisible(true);
    }
    if (status == 'update') {
        Update();
        vm.businessPOJO().detailVisible(true);
        vm.businessPOJO().setVisible(true);
    }
}
;

// *******YOUR SHOULD CODING IN HERE:*******
var businessValidation = function () {
    var errorMessages = [];
    //validate logic...

    //validate

    vm.businessPOJO().stringzeta_header_json(vm.businessPOJO().tableModel().header2json());

    ValidationPOJO.validate("Creator", vm.businessPOJO().creator(), errorMessages, ['KEY_NOT_NULL']);
    // ValidationPOJO.validate("Create Time", vm.businessPOJO().createtime(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Data Source Name", vm.businessPOJO().name(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Data Source URI", vm.businessPOJO().stringzeta_ds(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Data Source Rest Mode", vm.businessPOJO().stringzeta_rest_mode(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Data Source Refresh Interval", vm.businessPOJO().stringzeta_refresh_interval(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Data Source Header", vm.businessPOJO().stringzeta_header_json(), errorMessages, ['KEY_NOT_NULL']);

    return errorMessages;
}
var settingValidation = function () {

}


// *******YOUR SHOULD CODING IN HERE:*******
var runService = function () {
    // default_add_logic();
    if (vm.businessPOJO().id()) {
        default_update_logic();
    } else {
        default_add_logic();
    }
}


$.subscribe("MATRIX_API_SUCCESS_EVENT", MATRIX_API_SUCCESS_EVENT_HANDLER);

function MATRIX_API_SUCCESS_EVENT_HANDLER() {
    if (arguments && arguments[1]) {
        if (arguments[1].addtion && (arguments[1].addtion['TAG'] == 'MATRIX_DATA_SOURCE_TESTING' || arguments[1].addtion['TAG'] == 'MATRIX_DATA_SOURCE_RETRIEVE')) {
            var server_data = arguments[1].response;
            var res = JSON.stringify(arguments[1].response);
            vm.businessPOJO().stringzeta_ds_response(res);
            vm.businessPOJO().stringzeta_ds_response_data = server_data;
            if (arguments[1].addtion['TAG'] == 'MATRIX_DATA_SOURCE_RETRIEVE') {
                //continue to reload table
                vm.businessPOJO().reload_table();
            }
        }

        if (arguments[1].addtion && (arguments[1].addtion['TAG'] == 'MATRIX_ADD' || arguments[1].addtion['TAG'] == 'MATRIX_UPDATE')) {
            var server_data = arguments[1].response.result[0];
            vm.businessPOJO().reload(server_data);




            // var ds = JSON.parse(server_data.stringzeta);
            // reload_dynamic_table(ds);
        }
    }
}


var check_data_source = function (type) {
    vm.businessPOJO().stringzeta_ds_response('');
    var type_test = 'MATRIX_DATA_SOURCE_TESTING';
    var type_retrieve = 'MATRIX_DATA_SOURCE_RETRIEVE';
    var type_current = type ? type_test : type_retrieve;

    if (!vm.validation(function () {
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
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (err) {
                vm.response_vm().errorResponse("JSON解析失败，请检查JSON格式", "JSON解析", "[失败]");
                setTimeout(function () {
                    vm.response_vm().reset();
                }, 3000);
                return
            }

        }
        $.serverRequest(vm.businessPOJO().stringzeta_ds().trim(), data, "DEFAULT_RETRIEVE_API_SUCCESS_LISTENER", "DEFAULT_RETRIEVE_API_FAILED_LISTENER", "DEFAULT_RETRIEVE_API_EXCEPTION_LISTENER", mode, true, {'TAG': type_current});
    }

}

var gen_table = function () {
    var server_data = vm.businessPOJO().stringzeta_ds_response_data;
    var json_rule = vm.businessPOJO().stringzeta_json_rule();
    console.log($.toJSON(server_data))
    if (!server_data) {
        return;
    }
    if (json_rule) {
        var tmp = 'server_data.' + json_rule;
        server_data = eval(tmp);
    }
    if (!jQuery.isArray(server_data)) {
        vm.response_vm().warningResponse("The JSON fragment must be array type.", "[Generate Table]", "***Violate Validation Rules***");
        setTimeout(function () {
            vm.response_vm().reset();
        }, 3000);
        return;
    }
    var tableData = DataTransferPOJO.serverJsonData2TableData(server_data);
    var header = tableData.header;
    var l = header.length;
    for (var i = 0; i < l; i++) {
        header[i] = "col " + header[i];
    }
    var tableModel = new ThinListViewModel();
    tableModel.buildData(tableData.result);
    tableModel.columnNames(header);
    tableModel.isDisplayPager(true);
    tableModel.buildView();
    tableModel.pageMaxSize(vm.businessPOJO().tableModel().pageMaxSize());
    vm.businessPOJO().tableModel(tableModel);
    vm.businessPOJO().showTable(true);
}




function dynamic_table_env_setup() {
    MATRIX_DYNAMIC_TABLE_ENV_SETUP();
}

function reload_dynamic_table(ds) {
    if (ds) {
        setTimeout(function () {
            create_dynamic_table(ds, 'copy_table_parent_div', 'copied_table_div');
            vm.businessPOJO().data_source_table_display(true);
        }, 600)
    }
}

function Update() {
    vm.businessPOJO().detailVisible(true);
    vm.businessPOJO().setVisible(true);
}

function Remove() {
    vm.businessPOJO().deleted(true);
    default_update_logic();
    window.location.href = $.getRootPath() + '/business_gallery.html';
}

function changeColName(data) {
    console.log(data);
}