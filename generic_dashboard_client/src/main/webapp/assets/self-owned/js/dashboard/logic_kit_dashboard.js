var vm = new GenericPageViewModel();
//Clean Data Bind Node for dynamic table
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
  var businessPOJO = new BusinessPOJO();
  vm.businessPOJO(businessPOJO);
}
