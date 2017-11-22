var vm = new GenericPageViewModel();
//Clean Data Bind Node for dynamic table
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
// Refrence the entire page view model to current view model as cache
current_vm = vm;
current_max_x = 0;

function env_setup() {
    cookie_env_setup();
    vm_env_setup();
    setup_default_workbench();
    DASHBOARD_DYNAMIC_TABLE_ENV_SETUP();
}

function cookie_env_setup() {
    var token_lag = $.hasUrlParam('token');
    if (token_lag) {
        var token = $.urlParamValue('token');
        if (token) {
            CachePOJO.businessPOJO = token;
        }
    }
}

// Setup the business model with view model
function vm_env_setup() {
    var businessPOJO = new DashboardViewModel(vm);
    vm.businessPOJO(businessPOJO);
    if (CachePOJO.businessPOJO) {
        $.serverRequest($.getServerRoot() + '/service_generic_query/api/share/fetch/' + CachePOJO.businessPOJO, null, "MATRIX_SHARE_SUCCESS", "DEFAULT_RETRIEVE_API_FAILED_LISTENER", "DEFAULT_RETRIEVE_API_EXCEPTION_LISTENER");
    }
    window.addEventListener("beforeunload", function (e) {
        if (vm.businessPOJO().hasNewContent()) {
            var confirmationMessage = 'if you see this, you are definitely the chosen one';
            (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
            return confirmationMessage; // Gecko and WebKit
        }
    });
}

$.subscribe("MATRIX_SHARE_SUCCESS", successListener);

function successListener() {
    if (arguments && arguments[1]) {
        var json = arguments[1].result[0];
        if (vm && vm.businessPOJO()) {
            vm.businessPOJO().deserialize_dashboard(json);
            vm.businessPOJO().hasNewContent(false);
            // if(current_mode == 'EDIT'){
            //   userCheck();
            // }
        }
        // console.log(json);
        // deserialize_dashboard(json);
        // $('.grid-stack-item-header').css('display','none');
    }
}


$.subscribe("WORKBENCH_EVENT_CHANGE", WORKBENCH_EVENT_CHANGE_LISTENER);

function WORKBENCH_EVENT_CHANGE_LISTENER() {
    if (vm && vm.businessPOJO()) {

        vm.businessPOJO().hasNewContent(true);
    }
}

function addCell_chart(json, theme) {
    if (json) {
        if (typeof json == 'string') {
            var option = ChartPOJO.deserialize_chart_option(json);
        } else {
            var option = json;
        }
        registerTheme(theme, option);
        if (option.series[0].type == 'wordCloud') {
            var a = option.series;
            a[0].textStyle.normal.color = function () {
                var color = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                return color[parseInt(Math.random() * 10)];
            };
            option.series = a;
        }
        //
        //update cache
        WorkbenchCache.updateCache();
        var max_widget_y = 0;
        var max_widget_y_height = null;
        $.each(WorkbenchCache.array_elements, function (i, v) {
            if (max_widget_y <= v.widget_element.widget_y) {
                max_widget_y = v.widget_element.widget_y;
                max_widget_y_height = v.widget_element.widget_height;
            }
        });
        max_widget_y_height = max_widget_y_height || 6;
        max_widget_y = max_widget_y + max_widget_y_height;
        addWidget_chart(option, 0, max_widget_y, '', '', '', theme);
        WORKBENCH_EVENT_CHANGE_LISTENER();
    }
}


function addCell_table(json, theme) {


    //update cache
    WorkbenchCache.updateCache();
    var max_widget_y = 0;
    var max_widget_y_height = null;
    $.each(WorkbenchCache.array_elements, function (i, v) {
        if (max_widget_y <= v.widget_element.widget_y) {
            max_widget_y = v.widget_element.widget_y;
            max_widget_y_height = v.widget_element.widget_height;
        }
    });
    max_widget_y_height = max_widget_y_height || 6;
    max_widget_y = max_widget_y + max_widget_y_height;

    addWidget_table(json, 0, max_widget_y, '', '', '', theme);
    WORKBENCH_EVENT_CHANGE_LISTENER();
}



// *******Server Side Retrieve Data JS Code*******
var retrieveData_chart = function (page) {
    //        LoaderUtil.add('tableDIV');
    var requestPOJO = {
        "className": "Share",
        "orderMap": {
            "id": false
        },
        "pageMaxSize": pageMaxSize,
        "currentPageNumber": page || 1,
        "likeORMap": {},
        "eqMap": {
            "username": UserPOJO.user.userName,
            "type": "MATRIX_CHART",
            "deleted": false
        },
        "inMap": {},
    };
    var data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "CHART_SEARCH_SUCCESS_LISTENER", "CHART_PAGING_SEARCH_FAILED", "CHART_SERVICE_GENERIC_QUERY_FAILED");
}


// *******Server Side Retrieve Data Listener JS Code*******
$.subscribe("CHART_SEARCH_SUCCESS_LISTENER", successListener_chart);
$.subscribe("CHART_PAGING_SEARCH_FAILED", failedListener_chart);
$.subscribe("CHART_SERVICE_GENERIC_QUERY_FAILED", failedServiceListener_chart);

function failedServiceListener_chart() {
    if (!genericModalViewModel) {
        return;
    }
    genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", "SERVICE 'GENERIC CUD' FAILED! Please contact with the system admin for more information...");
}

function failedListener_chart() {
    if (!genericModalViewModel) {
        return;
    }
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].errorMessage;
        genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", errorMessage);
    }
}

function successListener_chart() {
    if (!genericModalViewModel) {
        return;
    }
    if (arguments && arguments[1]) {
        var data = arguments[1].result;
        displayResult = displayResult.concat(data);
        if (data.length < pageMaxSize) {
            hasNewData = false;
        }
        var history_scripts = displayResult.sort(sortTime);
        genericModalViewModel.businessPOJO().serverPagingViewModel.viewData(history_scripts);
    }
}


// *******Server Side Retrieve Table*******
var retrieveData_table = function (page) {
    //        LoaderUtil.add('tableDIV');
    var requestPOJO = {
        "className": "Genericentity",
        "orderMap": {
            "id": false
        },
        "pageMaxSize": pageMaxSize,
        "currentPageNumber": page || 1,
        "likeORMap": {},
        "eqMap": {
            "creator": UserPOJO.user.userName,
            "deleted": false
        },
        "inMap": {
            "type": ["GENERIC_MATRIX_DATA_SOURCE", "SOURCE_SQL_CONFIGURATION"]
        }
    };
    var data = {
        'queryJson': $.toJSON(requestPOJO)
    };
    $.serverRequest($.getServerRoot() + '/service_generic_query/api/query', data, "TABLE_SEARCH_SUCCESS_LISTENER", "TABLE_PAGING_SEARCH_FAILED", "TABLE_SERVICE_GENERIC_QUERY_FAILED");
}


// *******Server Side Retrieve Data Listener JS Code*******
$.subscribe("TABLE_SEARCH_SUCCESS_LISTENER", successListener_table);
$.subscribe("TABLE_PAGING_SEARCH_FAILED", failedListener_table);
$.subscribe("TABLE_SERVICE_GENERIC_QUERY_FAILED", failedServiceListener_table);

function failedServiceListener_table() {
    if (!genericModalViewModel) {
        return;
    }
    genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", "SERVICE 'GENERIC CUD' FAILED! Please contact with the system admin for more information...");
}

function failedListener_table() {
    if (!genericModalViewModel) {
        return;
    }
    if (arguments && arguments[1]) {
        var errorMessage = arguments[1].errorMessage;
        genericModalViewModel.response(false, "SERVICE 'GENERIC QUERY", "[Failed]", errorMessage);
    }
}

function successListener_table() {
    if (!genericModalViewModel) {
        return;
    }
    if (arguments && arguments[1]) {
        var data = arguments[1].result;
        console.log(data)
        displayResult = displayResult.concat(data);
        if (data.length < pageMaxSize) {
            hasNewData = false;
        }
        var history_scripts = displayResult.sort(sortTime);
        genericModalViewModel.businessPOJO().serverPagingViewModel.viewData(history_scripts);
    }
}



function sortTime(a, b) {
    return b.createtime - a.createtime;
}

function changeTheme(e) {
    var json = vm.businessPOJO().serialize_dashboard();
    vm.businessPOJO().deserialize_dashboard(json, e);
    WorkbenchCache.updateCache();
}

function clickDiv() {

    if (!vm.businessPOJO().viewHeader()) {
        var num = 2;
        vm.businessPOJO().domChoose = {};
        var domList = vm.businessPOJO().domChoose;
        $('.grid-stack-item-content').on('click', function (e) {
            e.preventDefault();
            var grid = $('.grid-stack').data('gridstack'),
                    el = $(this).closest('.grid-stack-item')
            var id = el[0].id;
            var div = {};
            if (num <= 0) {
                var dom = Object.keys(domList)
                if (dom.indexOf(id) < 0) {
                    return;
                }
            }
            WorkbenchCache.array_elements.forEach(function (e) {
                if (e.widget_id == id) {
                    div = e.widget_element
                }
            });
            if (!div.isClick) {
                $('#' + id).find('.card-body').css('border', '5px solid red')
                num = num - 1;
                domList[id] = div;
            } else {
                $('#' + id).find('.card-body').css('border', '');
                num = num + 1;
                delete domList[id];
            }
            div.isClick = !div.isClick;
            console.log(vm.businessPOJO().domChoose)
            console.log(num);
        })
    }
}


function togetherDiv() {
    $('.grid-stack-item-content').off('click');
    WorkbenchCache.updateCache();
    var domList = vm.businessPOJO().domChoose;
    if (Object.getOwnPropertyNames(domList).length < 2) {
        alert('Please choose two div');
        var dom = Object.keys(domList);
        domList[dom[0]].isClick = false;
        $('#' + dom[0]).find('.card-body').css('border', '');
        return;
    }

    var dom = Object.keys(domList);
    domList[dom[0]].isClick = false;
    domList[dom[1]].isClick = false;
    var id_1_x = domList[dom[0]].widget_x;
    var id_2_x = domList[dom[1]].widget_x;
    var id_1_y = domList[dom[0]].widget_y;
    var id_2_y = domList[dom[1]].widget_y;
    var id_1_h = domList[dom[0]].widget_y + domList[dom[0]].widget_height;
    var id_2_h = domList[dom[1]].widget_y + domList[dom[1]].widget_height;
    var id_1_w = domList[dom[0]].widget_x + domList[dom[0]].widget_width;
    var id_2_w = domList[dom[1]].widget_x + domList[dom[1]].widget_width;


    if (id_1_x == id_2_w) {
        $('#' + dom[0]).find('.card-body').css('padding-left', '0px');
        $('#' + dom[1]).find('.card-body').css('padding-right', '0px');
        domList[dom[0]].isLeft = true;
        domList[dom[1]].isRight = true;
    } else if (id_2_x == id_1_w) {
        $('#' + dom[1]).find('.card-body').css('padding-left', '0px');
        $('#' + dom[0]).find('.card-body').css('padding-right', '0px');
        domList[dom[1]].isLeft = true;
        domList[dom[0]].isRight = true;
    } else if (id_1_y == id_2_h) {
        $('#' + dom[0]).find('.card-body').css('padding-top', '0px');
        $('#' + dom[1]).find('.card-body').css('padding-bottom', '0px');
        var height_1 = $('#' + dom[0]).find('.draggableTemplateContext').height();
        var height_2 = $('#' + dom[1]).find('.draggableTemplateContext').height();
        if (!domList[dom[0]].isUp) {
            $('#' + dom[0]).find('.draggableTemplateContext').height(height_1 + 20);
            domList[dom[0]].isUp = true;
        }
        if (!domList[dom[1]].isDown) {
            $('#' + dom[1]).find('.draggableTemplateContext').height(height_2 + 20);
            domList[dom[1]].isDown = true;
        }

    } else if (id_2_y == id_1_h) {
        $('#' + dom[1]).find('.card-body').css('padding-top', '0px');
        $('#' + dom[0]).find('.card-body').css('padding-bottom', '0px');
        var height_1 = $('#' + dom[0]).find('.draggableTemplateContext').height();
        var height_2 = $('#' + dom[1]).find('.draggableTemplateContext').height();
        if (!domList[dom[1]].isUp) {
            $('#' + dom[1]).find('.draggableTemplateContext').height(height_2 + 20);
            domList[dom[1]].isUp = true;
        }
        if (!domList[dom[0]].isDown) {
            $('#' + dom[0]).find('.draggableTemplateContext').height(height_1 + 20);
            domList[dom[0]].isDown = true;
        }
    } else {
        alert('They can not commit!')
    }
    setTimeout(function () {
        dom.forEach(function (e) {
            var chart = chartCache[e];
            if (chart) {
                chart.resize();
            }
        });
    }, 1000);


    dom.forEach(function (e) {
        domList[e].isClick = false;
        $('#' + e).find('.card-body').css('border', '');
    });
    WorkbenchCache.updateCache();
}

function view_header() {
    $('.grid-stack-item-header').css('display', '');
    vm.businessPOJO().viewHeader(true);
}

function unview_header() {
    $('.grid-stack-item-header').css('display', 'none');
    vm.businessPOJO().viewHeader(false);
}
// function modal_env_setup() {
//   modal_vm_env_setup();
//   modal_search_env_setup();
//   modal_scroll_env_setup();
// }
//
// // Setup the business model with view model
// function modal_vm_env_setup() {
//
//   // *******YOUR SHOULD CODING IN HERE:*******
//   // function BusinessPOJO() {
//   //   var self = this;
//   //   self.elements = new ServerPagingViewModel();
//   // }
//   var businessPOJO = new GenericBusinessPOJO();
//   genericModalViewModel.businessPOJO(businessPOJO);
// }
//
// function modal_search_env_setup() {
//   SearchPOJO.listener = default_search_data;
//   SearchPOJO.likeOrMap = ["username", "stringalpha"];
//   SearchPOJO.sortKey = ['id'];
//   SearchPOJO.build_requestPOJO_prototype = modal_build_requestPOJO_prototype;
// }
//
// function modal_build_requestPOJO_prototype() {
//   var result = {
//     "className": "Share",
//     "orderMap": {
//       "id": false
//     },
//     "pageMaxSize": ScrollPOJO.pageMaxSize,
//     "currentPageNumber": ScrollPOJO.page || 1,
//     "eqMap": {
//       "type": "MATRIX_CHART",
//       "deleted": false
//     },
//     "inMap": {},
//   };
//
//   return result;
// }
//
//
// function modal_scroll_env_setup() {
//   ScrollPOJO.listener = default_retrive_api;
//   ScrollPOJO.reset();
//   ScrollPOJO.setup();
// }
//
//
//
//