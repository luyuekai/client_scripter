// *******Data Bind JS Code*******
var vm = new GenericPageViewModel();
ko.cleanNode($('#template-matrix-main-div')[0]);
// Apply data bind in view model and the whole dom
ko.applyBindings(vm, document.getElementById('template-matrix-main-div'));
current_vm = vm;

function env_setup() {
    vm_env_setup();
    search_env_setup();
    scroll_env_setup();
}

// Setup the business model with view model
function vm_env_setup() {

    function BusinessPOJO() {
        var self = this;
        self.elements = new ServerPagingViewModel();
        self.dataSourceType = ko.observable('ALL');
        self.isAPI = ko.observable(false);
        self.type = ko.observableArray(['ALL', 'API', 'Database']);
    }
    var businessPOJO = new BusinessPOJO();
    vm.businessPOJO(businessPOJO);
    vm.businessPOJO().dataSourceType.subscribe(function (newValue) {
        var type = vm.businessPOJO().dataSourceType();
        filterData(type);
    });
}

function filterData(type) {
    if (type == 'ALL') {
        SearchPOJO.build_requestPOJO_prototype = function () {
            var result = {
                "className": "Genericentity",
                "orderMap": {
                    "id": false
                },
                "pageMaxSize": ScrollPOJO.pageMaxSize,
                "currentPageNumber": ScrollPOJO.page || 1,
                "eqMap": {
                    "creator": UserPOJO.user.userName,
                    "deleted": false
                },

                "inMap": {
                    "type": ["SOURCE_SQL_CONFIGURATION", "GENERIC_MATRIX_DATA_SOURCE"]
                }
            };
            return result;
        }
        SearchPOJO.listener();
    } else if (type == 'API') {
        SearchPOJO.build_requestPOJO_prototype = function () {
            var result = {
                "className": "Genericentity",
                "orderMap": {
                    "id": false
                },
                "pageMaxSize": ScrollPOJO.pageMaxSize,
                "currentPageNumber": ScrollPOJO.page || 1,
                "eqMap": {
                    "creator": UserPOJO.user.userName,
                    "deleted": false
                },

                "inMap": {
                    "type": ["GENERIC_MATRIX_DATA_SOURCE"]
                }
            };
            return result;
        }
        SearchPOJO.listener();
    } else if (type == 'Database') {
        SearchPOJO.build_requestPOJO_prototype = function () {
            var result = {
                "className": "Genericentity",
                "orderMap": {
                    "id": false
                },
                "pageMaxSize": ScrollPOJO.pageMaxSize,
                "currentPageNumber": ScrollPOJO.page || 1,
                "eqMap": {
                    "creator": UserPOJO.user.userName,
                    "deleted": false
                },

                "inMap": {
                    "type": ["SOURCE_SQL_CONFIGURATION"]
                }
            };
            return result;
        }
        SearchPOJO.listener();
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
                "creator": UserPOJO.user.userName,
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

function show_data(data, status) {
    var tip = data.stringtheta;
    if (data.type == 'SOURCE_SQL_CONFIGURATION') {
        window.open($.getRootPath() + '/business_kit_db.html' + '?status=' + status + '&token=' + tip);
    } else {
        window.open($.getRootPath() + '/business_kit.html' + '?status=' + status + '&token=' + tip);
    }
}


$.subscribe("galleryRemoveSuccess", successRemove);
function successRemove() {
    ScrollPOJO.reset();
     filterData(vm.businessPOJO().dataSourceType());
     setTimeout(function() {
        LoaderUtil.remove_v3('genericModalDiv');
         ModalUtil.modal_close('popupModalPro')
      }, 2000);
   
}