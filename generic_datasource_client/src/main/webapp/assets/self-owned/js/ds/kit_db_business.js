// *******Data Bind JS Code*******
// Initialize Generic Page View Model as entire page data bind parent element
var vm = new GenericPageViewModel();
// Clean Data Bind Node
ko.cleanNode($('#template-matrix-main-div')[0]);
////// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
var count = 0;
current_vm = vm;


var databaseCf = function (dbType, dbDriver) {
    this.dbType = dbType;
    this.dbDriver = dbDriver;
}

var databaseChooseViewModel = {
    selectedDatabase: ko.observableArray([]),
    availableSchema: ko.observableArray(),
    selectedSchema: ko.observable(),
    availableTable: ko.observableArray(),
    selectedTable: ko.observable(),
    column: ko.observableArray(),
    selectedColumn: ko.observable(false),

    schemaHasResult: ko.observable(false),
    tableHasResult: ko.observable(false),
    columnHasResult: ko.observable(false),
}


// *******ENV SETUP BEGIN *******
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

function vm_env_setup() {

    function BusinessPOJO() {
        var self = this;

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
        self.databasesetVisible = ko.observable(false);
        self.datasourcesetVisible = ko.observable(false);
        self.connectionVisible = ko.observable(false);
        self.codeMirror = null;
        self.token = hex_sha1(self.createtime + new Date().getTime());

        //database
        self.dataBases = ko.observableArray([
            new databaseCf("Postgresql", "org.postgresql.Driver"),
            new databaseCf("MySql", "com.mysql.jdbc.Driver"),
            new databaseCf("Oracle", "oracleDriver", "oracleUrl"),
            new databaseCf("GreenPlum", "org.postgresql.Driver")
        ]);

        self.databaseType = ko.observable();
        self.databaseDriver = ko.computed(function () {
            var l = self.dataBases().length;
            var result;
            for (var i = 0; i < l; i++) {
                if (self.dataBases()[i].dbType == self.databaseType()) {
                    result = self.dataBases()[i].dbDriver;
                }
            }
            return result;
        });
        self.databaseUrl = ko.observable('jdbc:postgresql://localhost:5432/scripter');
        self.connectionName = ko.observable('');
        self.username = ko.observable('postgres');
        self.passwd = ko.observable('');
        self.databaseConnections = ko.observable(new ThinListViewModel());

        self.databaseSelected = databaseChooseViewModel;
        self.databaseSelectedName = ko.observable();
        self.sql = ko.observable('select id,stringalpha from genericentity limit 10;');

        self.showTable = ko.observable(false);
        self.tableModel = ko.observable(new ThinListViewModel());

        self.server_data = null;
        self.deleted = ko.observable(false);
        self.data_source_table_display = ko.observable(false);

        self.stringzeta_ds_response = ko.observable();
        self.stringzeta_ds_response_data = null;
        self.stringzeta_ds = ko.observable('http://localhost:8080/generic_datasource_client/api/connection/query')

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
        self.stringzeta_rest_mode = ko.observable('POST');
        self.stringzeta_request_params = ko.observable();



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
                var url = pojo.stringalpha;
                var name = pojo.description;
                //database=[name,username,url,id]
                var database = [name, '', url, ''];
                ds = ds.attr;
                self.databaseSelected.selectedDatabase(database);
                self.stringzeta_ds(ds.ds);
                self.stringzeta_refresh_interval(ds.refresh_interval);
                self.stringzeta_rest_mode(ds.rest_mode);
                self.stringzeta_header_json(ds.header_json);
                self.stringzeta_request_params(ds.request_params);
                check_data_source();
            }
        }

        self.reload_table = function () {
            self.detailVisible(true);
            gen_table();
            var header_model_list = self.tableModel().json2header(self.stringzeta_header_json());

            self.tableModel().headerViewData(header_model_list);
            var ds = JSON.parse(self.ds());
            var attr = ds.attr;
            reload_dynamic_table(attr);
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
            self.databaseUrl(null);
            self.stringzeta_refresh_interval('30');
            self.stringzeta_ds(null);
            self.stringzeta_header_json(null);
//            self.stringzeta_pageMaxSize(null);
//            self.stringzeta_mock(false);
            self.stringzeta_ds_response(null);
            self.stringzeta_ds_response_data = null;
            self.showTable(false);
            self.tableModel(new ThinListViewModel());
        }

        self.connection_clear = function () {
            self.databaseType(null);
            self.databaseUrl('jdbc:postgresql://localhost:5432/scripter');
            self.connectionName(null);
            self.username('postgres');
            self.passwd(null);
            $("#startstep").prop("class", "active");
            $("#step2-v3-horizantal").prop("class", "tab-pane");
            $("#step3-v3-horizantal").prop("class", "tab-pane");
            $("#step1-v3-horizantal").prop("class", "tab-pane active");

            $("#excuteNew").prop("disabled", true);
        }

        self.stringzeta_header_json = ko.observable();

        self.build_requestPOJO = function () {
            self.createtime((new Date()).getTime());
            var requestPOJO = {
                "className": "v2.service.generic.query.entity.Genericentity",
                "attributes": {
                    "type": "SOURCE_SQL_CONFIGURATION",
                    "creator": self.creator(),
                    "name": self.name(),
                    "numberalpha": self.createtime(),
                    "numberbeta": self.lastupdatetime(),
                    "description": self.databaseSelected.selectedDatabase()[0],
                    "deleted": self.deleted(),
                    "enabled": true,
                    "stringalpha": self.databaseSelected.selectedDatabase()[2],
                    "stringtheta": self.token,
                    "stringbeta": self.sql(),
                    "stringzeta": self.ds(),
                    "stringeta": self.formatTime(),
                }
            };
//            console.log("deleted = " + requestPOJO.attributes.deleted)
            if (self.id()) {
                requestPOJO.attributes.id = self.id();
            }
            return requestPOJO;
        }

        self.stringzeta_request_params = ko.observable();
        self.ds = ko.computed(function () {
            var json = {
                'mode': 'database',
                'attr': {
                    'request_params': self.stringzeta_request_params(),
                    'ds': self.stringzeta_ds(),
                    'header_json': self.tableModel().header2json(),
                    'refresh_interval': self.stringzeta_refresh_interval(),
                    'rest_mode': self.stringzeta_rest_mode(),
                    'pageMaxSize': self.tableModel().pageMaxSize(),
                    'json_rule': 'result',
                    'source_data': 'database'
//                'mock': self.stringzeta_mock()
                }
            }
            return JSON.stringify(json);
        });
    }


    var businessPOJO = new BusinessPOJO();
    businessPOJO.creator(UserPOJO.user.userName);
    vm.businessPOJO(businessPOJO);
    $("#excuteNew").prop("disabled", true);

    vm.businessPOJO().databaseSelected.selectedDatabase.subscribe(function (newValue) {
        getSchemaInDatabase();
    });

    var status = $.urlParamValue('status');
    if (status == 'check') {
        vm.businessPOJO().detailVisible(true);
    } else if (status === 'remove') {
        Remove();
    } else if (status === 'update') {
        vm.businessPOJO().detailVisible(true);
        vm.businessPOJO().datasourcesetVisible(true);
    } else {
        vm.businessPOJO().connectionVisible(true);
    }

    retrieveDatabase();
}

function retrieveDatabase() {
    var requestPOJO = {
        "className": "v2.service.generic.query.entity.Genericentity",
        "aliasMap": {},
        "orderMap": {"id": false},
        "pageMaxSize": 1000000,
        "currentPageNumber": 1,
        "eqMap": {
            "deleted": false,
            "type": "SOURCE_DATABASE_CONFIGURATION"
        },
        "inMap": {},
    };
    var data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + "/service_generic_query/api/query", data, "successGetDatabase",
            "failedGetDatabase", "serverGetDatabase");
}

$.subscribe("successGetDatabase", successGetDatabase);
$.subscribe("failedGetDatabase", failedGetDatabase);
$.subscribe("serverGetDatabase", serverGetDatabase);

function successGetDatabase() {
    if (arguments && arguments[1]) {
        var result = arguments[1].result;
        var l = result.length;
        var table_data = [];
        for (var i = 0; i < l; i++) {
            var name = arguments[1].result[i].name;
            var username = arguments[1].result[i].stringdelta;
            var url = arguments[1].result[i].stringbeta;
            var id = arguments[1].result[i].id;
            var passwd = arguments[1].result
            table_data[i] = [name, username, url, id];
        }
        var header = ["Name", "User Name", "URL", ""];
        vm.businessPOJO().databaseConnections().buildData(table_data);
        vm.businessPOJO().databaseConnections().columnNames(header);
        vm.businessPOJO().databaseConnections().isDisplayPager(true);
        vm.businessPOJO().databaseConnections().buildView();
        vm.businessPOJO().databaseConnections().pageMaxSize(5);
//        vm.businessPOJO().databaseConnections().buildSearchData(arguments[1]);
    }
}
function failedGetDatabase() {
    console.log(arguments[1])
}
function serverGetDatabase() {

}

// *******ENV SETUP END *******


// ******* TEST CONNECTION BEGIN *******
var testConnection = function () {
    if (!vm.validation(businessValidation)) {
        return;
    } else {
        runTestPre();
    }
};

var businessValidation = function () {
    var errorMessages = [];
    //validate logic...

    //validate

    vm.businessPOJO().stringzeta_header_json(vm.businessPOJO().tableModel().header2json());

    ValidationPOJO.validate("Creator", vm.businessPOJO().creator(), errorMessages, ['KEY_NOT_NULL']);
    // ValidationPOJO.validate("Create Time", vm.businessPOJO().createtime(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database Type", vm.businessPOJO().databaseType(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database Url", vm.businessPOJO().databaseUrl(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database Name", vm.businessPOJO().connectionName(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database User Name", vm.businessPOJO().username(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database password", vm.businessPOJO().passwd(), errorMessages, ['KEY_NOT_NULL']);

    return errorMessages;
}

var runTestPre = function () {
    var requestPOJO = {
        "className": "v2.service.generic.query.entity.Genericentity",
        "aliasMap": {},
        "orderMap": {"id": false},
        "pageMaxSize": 1000000,
        "currentPageNumber": 1,
        "eqMap": {
            "stringbeta": vm.businessPOJO().databaseUrl().trim(),
            "deleted": false,
            "type": "SOURCE_DATABASE_CONFIGURATION"
        },
        "inMap": {},
    };
    var data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + "/service_generic_query/api/query", data, "successURL",
            "failURL", "serverURL");
}
$.subscribe("successURL", exsistUrl);
$.subscribe("failURL", runTest);
$.subscribe("serverURL", serverFailURL);

function exsistUrl() {

    var result = arguments[1].result
    if (result.length > 0) {
        vm.response_vm().errorResponse(" 测试数据库连接已经存在", "测试数据库连接", "[失败]");
    } else {
        runTest();
    }

}
function serverFailURL() {
    vm.response_vm().errorResponse(" 测试数据库连接失败,服务器错误", "测试数据库连接", "[失败]");
}

var runTest = function () {
    if (!vm.validation(businessValidation)) {
        return;
    }
    var requestPOJO = {
        "dbType": vm.businessPOJO().databaseType().trim(),
        "dbDriver": vm.businessPOJO().databaseDriver().trim(),
        "dbConName": vm.businessPOJO().connectionName().trim(),
        "dbUsername": vm.businessPOJO().username().trim(),
        "dbPasswd": vm.businessPOJO().passwd().trim(),
        "dbUrl": vm.businessPOJO().databaseUrl().trim()
    };

    var data = {
        "DBConfig": $.toJSON(requestPOJO)
    };

    $.serverRequest($.getServerRoot() + "/generic_datasource_client/api/connection/testconnection", data, "successTestConnection", "failedTestConnection",
            "failedServerConnection");
};

$.subscribe("successTestConnection", successTestConnection);
$.subscribe("failedTestConnection", failedTestConnection);
$.subscribe("failedServerConnection", failedServerConnection);

function successTestConnection() {
    if (arguments && arguments[1]) {
        vm.response_vm().correctResponse(" 测试数据库连接成功,请点击执行按钮", "测试数据库连接", "[成功]");
        $("#excuteNew").prop("disabled", false);
        $("#excuteUpdate").prop("disabled", false);
    }
}
function failedTestConnection() {
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].data;
        vm.response_vm().errorResponse(errorMessage, "测试数据库连接", "[失败]");
    }
}
function failedServerConnection() {
    vm.response_vm().errorResponse(" 测试数据库连接失败,服务器错误", "测试数据库连接", "[失败]");
}
// ******* TEST CONNECTION END *******


// ******* ADD CONNECTION BEGIN *******
var excuteAddConnection = function () {
    if (!vm.validation(businessValidation)) {
        return;
    } else {
        var requestPOJO = {
            "className": "v2.service.generic.query.entity.Genericentity",
            "attributes": {
                "creator": vm.businessPOJO().creator(),
                "description": vm.businessPOJO().databaseType().trim(),
                "name": vm.businessPOJO().connectionName().trim(),
                "numberalpha": vm.businessPOJO().createtime(),
                "numberbeta": vm.businessPOJO().lastupdatetime(),
                "stringalpha": vm.businessPOJO().databaseDriver().trim(),
                "stringbeta": vm.businessPOJO().databaseUrl().trim(),
                "stringdelta": vm.businessPOJO().username().trim(),
                "stringepsilon": vm.businessPOJO().passwd().trim(),
                "stringeta": vm.businessPOJO().formatTime(),
                "deleted": false,
                "enabled": true,
                "type": "SOURCE_DATABASE_CONFIGURATION"
            }

        };
        var database_data = {
            'queryJson': $.toJSON(requestPOJO)
        };
        $.serverRequest($.getServerRoot() + '/service_generic_query/api/cud/add', database_data, "ADD_SUCCESS_LISTENER_DATABASE",
                "ADD_FAILED_LISTENER_DATABASE", "ADD_SERVER_FAILED_LISTENER_DATABASE");
    }

}

$.subscribe("ADD_SUCCESS_LISTENER_DATABASE", successAddListener_database);
$.subscribe("ADD_FAILED_LISTENER_DATABASE", failedAddListener_database);
$.subscribe("ADD_SERVER_FAILED_LISTENER_DATABASE", failedServiceListener_database);

function successAddListener_database() {
    if (arguments && arguments[1]) {
        vm.response_vm().correctResponse("添加操作成功!", "添加数据库", "[成功]");
        vm.businessPOJO().databasesetVisible(false);

        var requestPOJO = {
            "dbType": vm.businessPOJO().databaseType().trim(),
            "dbDriver": vm.businessPOJO().databaseDriver().trim(),
            "dbConName": vm.businessPOJO().connectionName().trim(),
            "dbUsername": vm.businessPOJO().username().trim(),
            "dbPasswd": vm.businessPOJO().passwd().trim(),
            "dbUrl": vm.businessPOJO().databaseUrl().trim()
        };

        var data = {
            "DBConfig": $.toJSON(requestPOJO)
        };
        retrieveDatabase();
        $.serverRequest($.getServerRoot() + "/generic_datasource_client/api/connection/addconnection", data, "successADDConnection", "failedADDConnection",
                "failedServerADDConnection");

    }
}

function failedAddListener_database() {
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].data;
        vm.response_vm().errorResponse("请联系管理员", "添加数据库", "[失败]");
        setTimeout(function () {
            vm.response_vm().reset();
        }, 3000);
    }
}

function failedServiceListener_database() {
    vm.response_vm().errorResponse(" 测试数据库连接失败,服务器错误", "添加数据库", "[失败]");
    setTimeout(function () {
        vm.response_vm().reset();
    }, 3000);

}
// ******* ADD CONNECTION END *******


// ******* EDIT CONNECTION BEGIN *******
function detailConnection(data) {
    var requestPOJO = {
        "className": "v2.service.generic.query.entity.Genericentity",
        "aliasMap": {},
        "orderMap": {"id": false},
        "pageMaxSize": 1000000,
        "currentPageNumber": 1,
        "eqMap": {
            "id": data[3],
            "deleted": false,
            "type": "SOURCE_DATABASE_CONFIGURATION"
        },
        "inMap": {},
    };
    var data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + "/service_generic_query/api/query", data, "SUCCESS_DETAIL_CONNECTION",
            "FAIL_DETAIL_CONNECTION", "SERVER_DETAIL_CONNECTION");
}
$.subscribe("SUCCESS_DETAIL_CONNECTION", successDetailConnection);
$.subscribe("FAIL_DETAIL_CONNECTION", failedDetailConnection);
$.subscribe("SERVER_DETAIL_CONNECTION", failedServerDetailConnection);

function successDetailConnection() {
    if (arguments && arguments[1]) {
        var result = arguments[1].result[0];
        vm.businessPOJO().id(result.id);
        vm.businessPOJO().databaseType(result.description);
        vm.businessPOJO().databaseUrl(result.stringbeta);
        vm.businessPOJO().connectionName(result.name);
        vm.businessPOJO().username(result.stringdelta);
        vm.businessPOJO().passwd(result.stringepsilon);
        vm.businessPOJO().databasesetVisible(true);
        vm.businessPOJO().datasourcesetVisible(false);
        var update = document.getElementById("excuteUpdate");
        var check = document.getElementById("testConnection");
        var excute = document.getElementById("excuteNew");
        var test = document.getElementById("testUpdate");
        update.style.display = "";
        test.style.display = "";
        check.style.display = "none";
        excute.style.display = "none";
        $("#excuteUpdate").prop("disabled", true);
        $("#databaseUrl").prop("disabled", true)
    }
}
function failedDetailConnection() {
}
function failedServerDetailConnection() {
}

function excuteUpdateConnection() {
    var requestPOJO = {
        "className": "v2.service.generic.query.entity.Genericentity",
        "attributes": {
            "id": vm.businessPOJO().id(),
            "creator": vm.businessPOJO().creator(),
            "description": vm.businessPOJO().databaseType().trim(),
            "name": vm.businessPOJO().connectionName().trim(),
            "numberalpha": vm.businessPOJO().createtime(),
            "numberbeta": vm.businessPOJO().lastupdatetime(),
            "stringalpha": vm.businessPOJO().databaseDriver().trim(),
            "stringbeta": vm.businessPOJO().databaseUrl().trim(),
            "stringdelta": vm.businessPOJO().username().trim(),
            "stringepsilon": vm.businessPOJO().passwd().trim(),
            "stringeta": vm.businessPOJO().formatTime()
        }

    };
    var database_data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/cud/update', database_data, "UPDATE_SUCCESS_LISTENER_DATABASE",
            "UPDATE_FAILED_LISTENER_DATABASE", "UPDATE_SERVER_FAILED_LISTENER_DATABASE");
//    vm.businessPOJO().detailVisible(false);
}
$.subscribe("UPDATE_SUCCESS_LISTENER_DATABASE", successUpdateConnection);
function successUpdateConnection() {
    if (arguments && arguments[1]) {
        vm.response_vm().correctResponse(" 更新数据库信息成功", "更新数据库连接", "[成功]");
        retrieveDatabase();
        vm.businessPOJO().databasesetVisible(false);
        setTimeout(function () {
            vm.response_vm().reset();
        }, 3000);
    }
}
// ******* EDIT CONNECTION END *******


// ******* ADD DataSource BEGIN *******
function chooseDataBase(data) {
    vm.businessPOJO().databaseSelected.selectedDatabase(data);
    vm.businessPOJO().databasesetVisible(false);
    vm.businessPOJO().datasourcesetVisible(true);
}

var businessValidation_table = function () {
    var errorMessages = [];
    //validate logic...

    //validate

    vm.businessPOJO().stringzeta_header_json(vm.businessPOJO().tableModel().header2json());

    ValidationPOJO.validate("SQL", vm.businessPOJO().sql(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database Name", vm.businessPOJO().databaseSelected.selectedDatabase(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Database URL", vm.businessPOJO().databaseSelected.selectedDatabase(), ['KEY_NOT_NULL']);
//    ValidationPOJO.validate("Database Selected Table", vm.businessPOJO().databaseSelected.selectedTable(), errorMessages, ['KEY_NOT_NULL']);

    return errorMessages;
}
function tableset_execute() {
    if (!vm.validation(businessValidation_table)) {
        return;
    } else {
        vm.businessPOJO().detailVisible(true);
        vm.businessPOJO().datasourcesetVisible(false);
        vm.businessPOJO().connectionVisible(false);
        runServiceSQL();
    }
}
function runServiceSQL() {
    var requestPOJO = {
        "dbName": vm.businessPOJO().databaseSelected.selectedDatabase()[2],
        "sql": vm.businessPOJO().sql()
    }
    var requestData = {
        "queryInfo": $.toJSON(requestPOJO)
    }
    $.serverRequest($.getServerRoot() + '/generic_datasource_client/api/connection/query', requestData, "successRunSql",
            "failedRunSql", "serverRunSql");
    $.subscribe("successRunSql", tableset_runService);
    $.subscribe("failedRunSql", failServiceSql);
    $.subscribe("serverRunSql", serverServiceSql);
}
function failServiceSql() {
    vm.response_vm().errorResponse("请检查SQL语句是否正确", "创建SQL", "[失败]");
}
function serverServiceSql() {
    vm.response_vm().errorResponse("操作失败，请检查操作步骤或与系统管理员联系", "创建SQL", "[失败]");
}

var tableset_runService = function () {

    var params = {
        "dbName": vm.businessPOJO().databaseSelected.selectedDatabase()[2],
        "sql": vm.businessPOJO().sql()
    }

    var requestData = {
        "queryInfo": $.toJSON(params)
    }
    var request = JSON.stringify(requestData);
    vm.businessPOJO().stringzeta_request_params(request);

    if (vm.businessPOJO().id()) {
        default_update_logic();
    } else {
        default_add_logic();
    }
}

$.subscribe("MATRIX_API_SUCCESS_EVENT", successAddSql);

function successAddSql() {
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
        }
    }
}
// ******* ADD DataSource END *******


// ******* Dynamic Table BEGIN *******
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

var check_data_source = function (type) {
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
        $.serverRequest(vm.businessPOJO().stringzeta_ds(), JSON.parse(data), "DEFAULT_RETRIEVE_API_SUCCESS_LISTENER", "DEFAULT_RETRIEVE_API_FAILED_LISTENER", "DEFAULT_RETRIEVE_API_EXCEPTION_LISTENER", mode, true, {'TAG': type_current});
    }

}
var gen_table = function () {
    var server_data = vm.businessPOJO().stringzeta_ds_response_data;
    console.log($.toJSON(server_data))
    if (!server_data) {
        return;
    }

    var tmp = 'server_data.result';
    server_data = eval(tmp);

    var tableData = DataTransferPOJO.transferHiveData(server_data[0]);
    var tableModel = new ThinListViewModel();

    tableModel.buildData(tableData.result);
    tableModel.columnNames(tableData.header);
    tableModel.isDisplayPager(true);
    tableModel.buildView();
    tableModel.pageMaxSize(vm.businessPOJO().tableModel().pageMaxSize());
    vm.businessPOJO().tableModel(tableModel);
    vm.businessPOJO().stringzeta_header_json(vm.businessPOJO().tableModel().header2json());
    vm.businessPOJO().showTable(true);
}
// ******* Dynamic Table END *******



// ******* BUTTON && PAGE FUNCTION BEGIN *******
function showPasswd() {
    if ((count % 2) == 0) {
        $("#DBpassword").attr("type", "text");
    } else {
        $("#DBpassword").attr("type", "password");
    }
    count++;
}

function getSchemaInDatabase() {
    if (vm.businessPOJO().databaseSelected.selectedDatabase() != undefined) {
        vm.businessPOJO().databaseSelected.availableSchema.removeAll();
        $.ajax({
            dataType: "text",
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            url: $.getServerRoot() + "/generic_datasource_client/api/connection/schemas",
            data: {
                'DBName': vm.businessPOJO().databaseSelected.selectedDatabase()[2]
            }
        }).done(function (data) {
            var data = JSON.parse(data);
            if (!data.hasError) {
                var table = data.result[0].split("\n");
                if (table[0] && table[0] === "schema_name,schema_owner") {
                    var databases = [];
                    var l = table.length - 1;
                    for (var i = 1; i < l; i++) { //i = 1 开始，i=0 对应表头
                        var tmp = seperateByComma(table[i]);
                        databases.push({
                            'name': tmp[0],
                            'owner': tmp[1]
                        });

                    }
                    for (var i = 0; i < databases.length; i++) {
                        vm.businessPOJO().databaseSelected.availableSchema.push({
                            "name": databases[i].name,
                            "attr": {
                                id: databases[i].name,
                                'owner': databases[i].owner
                            }
                        });
                    }
                }
                vm.businessPOJO().databaseSelected.schemaHasResult(true);
            }
        }).fail(function () {}).always(function () {})
    }

}
function getTableInDatabase(data) {
    vm.businessPOJO().databaseSelected.selectedSchema(data.name);
    $.ajax({
        dataType: "text",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        url: $.getServerRoot() + "/generic_datasource_client/api/connection/" + data.name + "/tables",
        data: {
            'DBName': vm.businessPOJO().databaseSelected.selectedDatabase()[2]
        }
    }).done(function (data) {
        var data = JSON.parse(data);
        if (!data.hasError) {
            vm.businessPOJO().databaseSelected.availableTable.removeAll();
            var table = data.result[0].split("\n")
            var l = table.length - 1;
            for (var i = 1; i < l; i++) {
                vm.businessPOJO().databaseSelected.availableTable.push({
                    "name": table[i],
                    "schema": vm.businessPOJO().databaseSelected.selectedSchema(),
                    "attr": {
                        id: table[i]
                    }
                });
            }
            vm.businessPOJO().databaseSelected.tableHasResult(true);
        }
    }).fail(function () {}).always(function () {})

}
function getColumnInTable(data) {

    $.ajax({
        dataType: "text",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        url: $.getServerRoot() + "/generic_datasource_client/api/connection/" + data.schema + "/" + data.name + "/columns",
        data: {
            'DBName': vm.businessPOJO().databaseSelected.selectedDatabase()[2]
        }
    }).done(function (data) {
        var data = JSON.parse(data);

        if (!data.hasError) {
            vm.businessPOJO().databaseSelected.column.removeAll();
            var table = data.result[0].split("\n")
            var l = table.length - 1;
            for (var i = 1; i < l; i++) {
                vm.businessPOJO().databaseSelected.column.push({
                    "name": table[i].split(',')[0],
                    "attr": {
                        id: table[i],
                    }
                });
            }

            vm.businessPOJO().databaseSelected.columnHasResult(true);
        }
    }).fail(function () {}).always(function () {})

}
function Remove() {
    vm.businessPOJO().deleted(true);
    default_update_logic();
    window.location.href = $.getRootPath() + '/business_gallery.html';
}

function hide_configuration_panel(divToSwitch, showButtonDiv, hideButtonDiv) {
    hide_div(divToSwitch);
    show_div(showButtonDiv);
    hide_div(hideButtonDiv);
}
function show_configuration_panel(divToSwitch, showButtonDiv, hideButtonDiv) {
    show_div(divToSwitch);
    hide_div(showButtonDiv);
    show_div(hideButtonDiv);
}

function Update() {
    vm.businessPOJO().datasourcesetVisible(true);
}

function addConnection() {
    var update = document.getElementById("excuteUpdate");
    var check = document.getElementById("testConnection");
    var test = document.getElementById("testUpdate");
    var excute = document.getElementById("excuteNew");
    update.style.display = "none";
    test.style.display = "none";
    check.style.display = "";
    excute.style.display = "";
    vm.businessPOJO().connection_clear();
    vm.businessPOJO().databasesetVisible(true);
    vm.businessPOJO().detailVisible(false);
    vm.businessPOJO().datasourcesetVisible(false);
    $("#databaseUrl").prop("disabled", '')
}
// ******* BUTTON && PAGE FUNCTION END *******