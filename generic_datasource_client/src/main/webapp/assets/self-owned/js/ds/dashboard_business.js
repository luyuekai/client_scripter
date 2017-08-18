// *******Data Bind JS Code*******
// Initialize Generic Page View Model as entire page data bind parent element
var vm = new GenericPageViewModel();

var myChart = echarts.init(document.getElementById('actionnum'));
// Clean Data Bind Node
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
current_vm = vm;

var ds = {
    "ds": "http://localhost:8080/service_generic_query/api/query",
    "header_json": "[{\"data\":\"SUM_NUMBER\",\"index\":0,\"isChecked\":true,\"isDisplay\":true},{\"data\":\"Activity\",\"index\":1,\"isChecked\":true,\"isDisplay\":true}]",
    "refresh_interval": "60",
    "json_rule": "result",
    "rest_mode": "POST",
    "request_params": "{\"queryJson\":\"{\\\"className\\\":\\\"Genericentity\\\", \\\"groupMap\\\":{\\\"stringeta\\\":\\\"stringeta\\\"},\\\"orderMap\\\":{\\\"stringeta\\\":true},\\\"pageMaxSize\\\":100000,\\\"currentPageNumber\\\":1,\\\"eqMap\\\":{\\\"deleted\\\":false},\\\"inMap\\\":{\\\"type\\\":[\\\"GENERIC_MATRIX_DATA_SOURCE\\\",\\\"SOURCE_SQL_CONFIGURATION\\\"]}}\"}",
    "pageMaxSize": 10,
    "mock": true
};

function env_setup() {
    vm_env_setup();
    query_chain_env_setup();
    dynamic_table_env_setup();
    search_env_setup();
    scroll_env_setup();

}

function env_refresh() {
    query_chain_env_setup();

    ScrollPOJO.reset();
    ScrollPOJO.setup();
}

// Setup the business model with view model
function vm_env_setup() {

    // *******YOUR SHOULD CODING IN HERE:*******
    function BusinessPOJO() {
        var self = this;
        self.user = UserPOJO.user.userName;
        self.todayCounts = ko.observable();
        self.allCounts = ko.observable();
        self.userNum = ko.observable();
    }
    var businessPOJO = new BusinessPOJO();
    vm.businessPOJO(businessPOJO);
}
;

// *******YOUR SHOULD CODING IN HERE:*******
var businessValidation = function () {
    var errorMessages = [];
    //validate logic...

    //validate
    ValidationPOJO.validate("User", vm.businessPOJO().user(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Time", vm.businessPOJO().time(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Title", vm.businessPOJO().title(), errorMessages, ['KEY_NOT_NULL']);
    ValidationPOJO.validate("Money", vm.businessPOJO().description(), errorMessages, ['KEY_MUST_NUMBER']);
    return errorMessages;
}

// *******YOUR SHOULD CODING IN HERE:*******
var runService = function () {
    default_add_logic();
}

$.subscribe("MATRIX_API_SUCCESS_EVENT", MATRIX_API_SUCCESS_EVENT_HANDLER);

function MATRIX_API_SUCCESS_EVENT_HANDLER() {
    if (arguments && arguments[1]) {
        if (arguments[1].addtion && arguments[1].addtion['TAG'] == 'MATRIX_ADD') {
            env_refresh();
        }
    }
}

function search_env_setup() {
    SearchPOJO.listener = default_search_data;
    SearchPOJO.likeOrMap = ["creator", "name", "description"];
    SearchPOJO.sortKey = ['numberalpha'];
    SearchPOJO.build_requestPOJO_prototype = function () {
        var result = {
            "className": "Genericentity",
            "orderMap": {
                "id": false
            },
            "pageMaxSize": ScrollPOJO.pageMaxSize,
            "currentPageNumber": ScrollPOJO.page || 1,
            "eqMap": {

                "deleted": false
            },
            "inMap": {
                "type": ["SOURCE_SQL_CONFIGURATION", "GENERIC_MATRIX_DATA_SOURCE"]
            }
        };
        return result;
    }
}
function scroll_env_setup() {
    ScrollPOJO.listener = default_retrive_api;
    ScrollPOJO.setup();
}


function query_chain_env_setup() {
    var date = UtilPOJO.formatTime((new Date()).getTime(), 'yyyy-MM-dd');

    var today_counts = {
        'queryJson': $.toJSON({
            "className": "Genericentity",
            "pageMaxSize": 10,
            "currentPageNumber": 1,
            "eqMap": {
                "stringeta": date,
                "creator": UserPOJO.user.userName,
                "deleted": false
            },
            "inMap": {
                "type": ["SOURCE_SQL_CONFIGURATION", "GENERIC_MATRIX_DATA_SOURCE"]
            },
            "orderMap": {
                "id": false
            }
        })
    };
    var all_counts = {
        'queryJson': $.toJSON({
            "className": "Genericentity",
            "pageMaxSize": 10,
            "currentPageNumber": 1,
            "eqMap": {
                "creator": UserPOJO.user.userName,
                "deleted": false
            },
            "inMap": {
                "type": ["SOURCE_SQL_CONFIGURATION", "GENERIC_MATRIX_DATA_SOURCE"]
            },
            "orderMap": {
                "id": false
            }
        })
    };
    var user_counts = {
        'queryJson': $.toJSON({
            "className": "Genericentity",
            "pageMaxSize": 10,
            "currentPageNumber": 1,
            "eqMap": {
                "type": "GENERIC_MATRIX_DATA_SOURCE",
            },
            "groupMap": {
                "creator": "creator",
            },
            "inMap": {},
            "orderMap": {
                "id": false
            }
        })
    };


    QueryChainPOJO.queryArray = [];
    QueryChainPOJO.queryArray.push({'id': 1, 'tag': 'today_counts', 'query': today_counts});
    QueryChainPOJO.queryArray.push({'id': 2, 'tag': 'all_counts', 'query': all_counts});
    $.subscribe("query_chain_finished", statistic_result_listener);
    QueryChainPOJO.query();

}


var statistic_result_listener = function () {
    if (vm && vm.businessPOJO()) {
        var results = QueryChainPOJO.queryResults;
        $.each(results, function (index, value) {
            if (value.query.tag == 'today_counts') {
                vm.businessPOJO().todayCounts(value.response.totalCounts);
            }
            if (value.query.tag == 'all_counts') {
                vm.businessPOJO().allCounts(value.response.totalCounts);
            }
        })
    }
}
function dynamic_table_env_setup() {
    MATRIX_DYNAMIC_TABLE_ENV_SETUP();
    setTimeout(function () {
        create_dynamic_table(ds, 'copy_table_parent_div', 'copied_table_div');
        create_dynamic_chart_pie(ds, 'actionnum');
        create_dynamic_chart_line(ds, 'linenum', 'number');
    }, 100)
}

$.subscribe("MATRIX_API_SUCCESS_EVENT", function () {
    console.log("MATRIX_API_SUCCESS_EVENT INVOKED!")
});
