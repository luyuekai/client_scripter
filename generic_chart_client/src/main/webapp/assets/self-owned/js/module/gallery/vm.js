var genericViewModel = new ServerPagingViewModel();
ko.applyBindings(genericViewModel, document.getElementById('content_div'));

var responseViewModel = new ResponseViewModel();
ko.applyBindings(responseViewModel, document.getElementById('response_div'));


