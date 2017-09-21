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

  // *******YOUR SHOULD CODING IN HERE:*******
  // function BusinessPOJO() {
  //   var self = this;
  //   self.elements = new ServerPagingViewModel();
  // }
  var businessPOJO = new BusinessPOJO();
  vm.businessPOJO(businessPOJO);
}

function search_env_setup() {
  SearchPOJO.listener = default_search_data;
  SearchPOJO.likeOrMap = ["username", "stringalpha"];
  SearchPOJO.sortKey = ['id'];
  SearchPOJO.build_requestPOJO_prototype = retrieve_self_saved;
}

function retrieve_self_saved() {
  var result = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "eqMap": {
      "username": UserPOJO.user.userName,
      "type": "MATRIX_DASHBOARD",
      "deleted": false
    },
    "inMap": {},
  };
  return result;
}

function retrieve_self_shared() {
  var result = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "eqMap": {
      "username": UserPOJO.user.userName,
      "type": "MATRIX_DASHBOARD",
      'tag': 'SHARE', //'SAVE'
      "deleted": false
    },
    "inMap": {},
  };
  return result;
}

function retrieve_all_shared() {
  var result = {
    "className": "Share",
    "orderMap": {
      "id": false
    },
    "pageMaxSize": ScrollPOJO.pageMaxSize,
    "currentPageNumber": ScrollPOJO.page || 1,
    "eqMap": {
      "type": "MATRIX_DASHBOARD",
      'tag': 'SHARE', //'SAVE'
      "deleted": false
    },
    "inMap": {},
  };
  return result;
}

function scroll_env_setup() {
  ScrollPOJO.listener = default_retrive_api;
  ScrollPOJO.setup();
}


function redirect2editor(currentData) {
  if (currentData && currentData.token) {
    window.open($.getRootPath() + '/module_kit_dashboard.html?token=' + currentData.token);
  }
}

function redirect2viewer(currentData) {
  if (currentData && currentData.token) {
    window.open($.getRootPath() + '/module_kit_dashboard.html?token=' + currentData.token);
  }
}
